import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { databaseConfig } from '../database.config';
import { databaseEntities } from '../entities';
import { GENERATE_SQL_KEY } from '../infra.util';
import {
  AccessRepository,
  AlbumRepository,
  ApiKeyRepository,
  AssetRepository,
  AuditRepository,
  LibraryRepository,
  MoveRepository,
  PartnerRepository,
  PersonRepository,
  SharedLinkRepository,
  SystemConfigRepository,
  SystemMetadataRepository,
  TagRepository,
  UserRepository,
  UserTokenRepository,
} from '../repositories';
import { SqlLogger } from './sql.logger';

const sqlLogger = new SqlLogger();
const reflector = new Reflector();
const repositories = [
  AccessRepository,
  AlbumRepository,
  ApiKeyRepository,
  AssetRepository,
  AuditRepository,
  LibraryRepository,
  MoveRepository,
  PartnerRepository,
  PersonRepository,
  SharedLinkRepository,
  SystemConfigRepository,
  SystemMetadataRepository,
  TagRepository,
  UserTokenRepository,
  UserRepository,
];

const main = async () => {
  const targetDir = './src/infra/sql';
  await rm(targetDir, { force: true, recursive: true });
  await mkdir(targetDir);

  const moduleFixture = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        ...databaseConfig,
        entities: databaseEntities,
        logging: ['query'],
        logger: sqlLogger,
      }),
      TypeOrmModule.forFeature(databaseEntities),
    ],
    providers: [...repositories],
  }).compile();

  const app = await moduleFixture.createNestApplication().init();

  for (const Repository of repositories) {
    const data: string[] = [`-- NOTE: This file is auto generated by ./sql-generator\n`];
    const instance = app.get<typeof Repository>(Repository);
    const properties = Object.getOwnPropertyNames(Repository.prototype) as Array<keyof typeof Repository>;
    for (const key of properties) {
      const label = `${Repository.name}.${key}`;

      const target = instance[key];
      if (target instanceof Function === false) {
        continue;
      }

      const queries = reflector.get<any[]>(GENERATE_SQL_KEY, target);
      if (!queries) {
        continue;
      }

      // empty decorator implies calling with no arguments
      if (queries.length === 0) {
        queries.push({ params: [] });
      }

      for (const { name, params } of queries) {
        let queryLabel = label;
        if (name) {
          queryLabel += ` (${name})`;
        }
        sqlLogger.clear();
        try {
          await target.apply(instance, params);
        } catch {}
        if (sqlLogger.queries.length === 0) {
          console.warn(`No queries recorded for ${queryLabel}`);
          continue;
        }
        data.push([`-- ${queryLabel}`, ...sqlLogger.queries].join('\n'));
      }
    }

    const targetFile = Repository.name.replace(/[A-Z]/g, (letter) => `.${letter.toLowerCase()}`).replace('.', '');
    const file = join(targetDir, `${targetFile}.sql`);

    await writeFile(file, data.join('\n\n'));
  }

  console.log('Done');
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
