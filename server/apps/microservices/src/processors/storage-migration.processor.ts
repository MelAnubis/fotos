import { APP_UPLOAD_LOCATION } from '@app/common';
import { AssetEntity } from '@app/infra';
import { SystemConfigService } from '@app/domain';
import { QueueName, JobName } from '@app/domain';
import { StorageService } from '@app/storage';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Processor(QueueName.CONFIG)
export class StorageMigrationProcessor {
  readonly logger: Logger = new Logger(StorageMigrationProcessor.name);

  constructor(
    private storageService: StorageService,
    private systemConfigService: SystemConfigService,

    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
  ) {}

  /**
   * Migration process when a new user set a new storage template.
   * @param job
   */
  @Process({ name: JobName.TEMPLATE_MIGRATION, concurrency: 100 })
  async templateMigration() {
    console.time('migrating-time');
    const assets = await this.assetRepository.find({
      relations: ['exifInfo'],
    });

    const livePhotoMap: Record<string, AssetEntity> = {};

    for (const asset of assets) {
      if (asset.livePhotoVideoId) {
        livePhotoMap[asset.livePhotoVideoId] = asset;
      }
    }

    for (const asset of assets) {
      const livePhotoParentAsset = livePhotoMap[asset.id];
      const filename = asset.exifInfo?.imageName || livePhotoParentAsset?.exifInfo?.imageName || asset.id;
      await this.storageService.moveAsset(asset, filename);
    }

    await this.storageService.removeEmptyDirectories(APP_UPLOAD_LOCATION);
    console.timeEnd('migrating-time');
  }

  /**
   * Update config when a new storage template is set.
   * This is to ensure the synchronization between processes.
   * @param job
   */
  @Process({ name: JobName.CONFIG_CHANGE, concurrency: 1 })
  async updateTemplate() {
    await this.systemConfigService.refreshConfig();
  }
}
