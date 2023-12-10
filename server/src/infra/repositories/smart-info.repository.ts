import { Embedding, EmbeddingSearch, FaceEmbeddingSearch, ISmartInfoRepository } from '@app/domain';
import { getCLIPModelInfo } from '@app/domain/smart-info/smart-info.constant';
import { AssetEntity, AssetFaceEntity, SmartInfoEntity, SmartSearchEntity } from '@app/infra/entities';
import { ImmichLogger } from '@app/infra/logger';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DummyValue, GenerateSql } from '../infra.util';
import { asVector, isValidInteger } from '../infra.utils';

@Injectable()
export class SmartInfoRepository implements ISmartInfoRepository {
  private logger = new ImmichLogger(SmartInfoRepository.name);
  private faceColumns: string[];

  constructor(
    @InjectRepository(SmartInfoEntity) private repository: Repository<SmartInfoEntity>,
    @InjectRepository(AssetEntity) private assetRepository: Repository<AssetEntity>,
    @InjectRepository(AssetFaceEntity) private assetFaceRepository: Repository<AssetFaceEntity>,
    @InjectRepository(SmartSearchEntity) private smartSearchRepository: Repository<SmartSearchEntity>,
  ) {
    this.faceColumns = this.assetFaceRepository.manager.connection
      .getMetadata(AssetFaceEntity)
      .ownColumns.map((column) => column.propertyName)
      .filter((propertyName) => propertyName !== 'embedding');
  }

  async init(modelName: string): Promise<void> {
    const { dimSize } = getCLIPModelInfo(modelName);
    if (dimSize == null) {
      throw new Error(`Invalid CLIP model name: ${modelName}`);
    }

    const curDimSize = await this.getDimSize();
    this.logger.verbose(`Current database CLIP dimension size is ${curDimSize}`);

    if (dimSize != curDimSize) {
      this.logger.log(`Dimension size of model ${modelName} is ${dimSize}, but database expects ${curDimSize}.`);
      await this.updateDimSize(dimSize);
    }
  }

  @GenerateSql({
    params: [{ userIds: [DummyValue.UUID], embedding: Array.from({ length: 512 }, Math.random), numResults: 100 }],
  })
  async searchCLIP({ userIds, embedding, numResults, withArchived }: EmbeddingSearch): Promise<AssetEntity[]> {
    if (!isValidInteger(numResults, { min: 1 })) {
      throw new Error(`Invalid value for 'numResults': ${numResults}`);
    }

    let results: AssetEntity[] = [];
    await this.assetRepository.manager.transaction(async (manager) => {
      await manager.query(`SET LOCAL vectors.k = '${numResults}'`);
      await manager.query(`SET LOCAL vectors.enable_prefilter = on`);

      const query = manager
        .createQueryBuilder(AssetEntity, 'a')
        .innerJoin('a.smartSearch', 's')
        .where('a.ownerId IN (:...userIds )')
        .andWhere('a.isVisible = true');

      if (!withArchived) {
        query.andWhere('a.isArchived = false');
      }

      results = await query
        .andWhere('a.fileCreatedAt < NOW()')
        .leftJoinAndSelect('a.exifInfo', 'e')
        .orderBy('s.embedding <=> :embedding')
        .setParameters({ userIds, embedding: asVector(embedding) })
        .limit(numResults)
        .getMany();
    });

    return results;
  }

  @GenerateSql({
    params: [
      {
        userIds: [DummyValue.UUID],
        embedding: Array.from({ length: 512 }, Math.random),
        numResults: 100,
        maxDistance: 0.6,
      },
    ],
  })
  async searchFaces({ userIds, embedding, numResults, maxDistance, hasPerson }: FaceEmbeddingSearch): Promise<AssetFaceEntity[]> {
    if (!isValidInteger(numResults, { min: 1 })) {
      throw new Error(`Invalid value for 'numResults': ${numResults}`);
    }

    let results: AssetFaceEntity[] = [];
    await this.assetRepository.manager.transaction(async (manager) => {
      await manager.query(`SET LOCAL vectors.k = '${numResults}'`);
      const cte = manager
        .createQueryBuilder(AssetFaceEntity, 'faces')
        .select('1 + (faces.embedding <=> :embedding)', 'distance')
        .innerJoin('faces.asset', 'asset')
        .where('asset.ownerId IN (:...userIds )')
        .orderBy('1 + (faces.embedding <=> :embedding)')
        .setParameters({ userIds, embedding: asVector(embedding) })
        .limit(numResults);
      
      if (hasPerson) {
        cte.andWhere('faces."personId" IS NOT NULL');
      }

      this.faceColumns.forEach((col) => cte.addSelect(`faces.${col}`, col));

      const query = await manager
        .createQueryBuilder()
        .select('res.*')
        .addCommonTableExpression(cte, 'cte')
        .from('cte', 'res')
        .where('res.distance <= :maxDistance', { maxDistance })

      // TODO: decide whether to pre-filter or post-filter for this
      // if (hasPerson) {
      //   query.andWhere('res."personId" IS NOT NULL');
      // }

      results = await query.getRawMany();
    });

    return this.assetFaceRepository.create(results);
  }

  async upsert(smartInfo: Partial<SmartInfoEntity>, embedding?: Embedding): Promise<void> {
    await this.repository.upsert(smartInfo, { conflictPaths: ['assetId'] });
    if (!smartInfo.assetId || !embedding) {
      return;
    }

    await this.upsertEmbedding(smartInfo.assetId, embedding);
  }

  private async upsertEmbedding(assetId: string, embedding: number[]): Promise<void> {
    await this.smartSearchRepository.upsert(
      { assetId, embedding: () => asVector(embedding, true) },
      { conflictPaths: ['assetId'] },
    );
  }

  private async updateDimSize(dimSize: number): Promise<void> {
    if (!isValidInteger(dimSize, { min: 1, max: 2 ** 16 })) {
      throw new Error(`Invalid CLIP dimension size: ${dimSize}`);
    }

    const curDimSize = await this.getDimSize();
    if (curDimSize === dimSize) {
      return;
    }

    this.logger.log(`Updating database CLIP dimension size to ${dimSize}.`);

    await this.smartSearchRepository.manager.transaction(async (manager) => {
      await manager.query(`DROP TABLE smart_search`);

      await manager.query(`
        CREATE TABLE smart_search (
          "assetId"  uuid PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
          embedding  vector(${dimSize}) NOT NULL )`);

      await manager.query(`
        CREATE INDEX clip_index ON smart_search
          USING vectors (embedding cosine_ops) WITH (options = $$
          [indexing.hnsw]
          m = 16
          ef_construction = 300
          $$)`);
    });

    this.logger.log(`Successfully updated database CLIP dimension size from ${curDimSize} to ${dimSize}.`);
  }

  private async getDimSize(): Promise<number> {
    const res = await this.smartSearchRepository.manager.query(`
      SELECT atttypmod as dimsize
      FROM pg_attribute f
        JOIN pg_class c ON c.oid = f.attrelid
      WHERE c.relkind = 'r'::char
        AND f.attnum > 0
        AND c.relname = 'smart_search'
        AND f.attname = 'embedding'`);

    const dimSize = res[0]['dimsize'];
    if (!isValidInteger(dimSize, { min: 1, max: 2 ** 16 })) {
      throw new Error(`Could not retrieve CLIP dimension size`);
    }
    return dimSize;
  }
}
