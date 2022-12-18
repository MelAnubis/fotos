import { immichAppConfig } from '@app/common/config';
import { DatabaseModule } from '@app/database';
import { AssetEntity } from '@app/database/entities/asset.entity';
import { ExifEntity } from '@app/database/entities/exif.entity';
import { SmartInfoEntity } from '@app/database/entities/smart-info.entity';
import { UserEntity } from '@app/database/entities/user.entity';
import { QueueNameEnum } from '@app/job/constants/queue-name.constant';
import { ImmichDefaultJobOptions } from '@app/job/constants/queue-config.constant';
import { StorageModule } from '@app/storage';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImmichConfigModule } from 'libs/immich-config/src';
import { CommunicationModule } from '../../immich/src/api-v1/communication/communication.module';
import { MicroservicesService } from './microservices.service';
import { AssetUploadedProcessor } from './processors/asset-uploaded.processor';
import { GenerateChecksumProcessor } from './processors/generate-checksum.processor';
import { MachineLearningProcessor } from './processors/machine-learning.processor';
import { MetadataExtractionProcessor } from './processors/metadata-extraction.processor';
import { StorageMigrationProcessor } from './processors/storage-migration.processor';
import { ThumbnailGeneratorProcessor } from './processors/thumbnail.processor';
import { UserDeletionProcessor } from './processors/user-deletion.processor';
import { VideoTranscodeProcessor } from './processors/video-transcode.processor';

@Module({
  imports: [
    ConfigModule.forRoot(immichAppConfig),
    DatabaseModule,
    ImmichConfigModule,
    TypeOrmModule.forFeature([UserEntity, ExifEntity, AssetEntity, SmartInfoEntity]),
    StorageModule,
    BullModule.forRootAsync({
      useFactory: async () => ({
        prefix: 'immich_bull',
        redis: {
          host: process.env.REDIS_HOSTNAME || 'immich_redis',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          db: parseInt(process.env.REDIS_DBINDEX || '0'),
          password: process.env.REDIS_PASSWORD || undefined,
          path: process.env.REDIS_SOCKET || undefined,
        },
      }),
    }),
    BullModule.registerQueue(
      {
        name: QueueNameEnum.USER_DELETION,
        defaultJobOptions: ImmichDefaultJobOptions,
      },
      {
        name: QueueNameEnum.THUMBNAIL_GENERATION,
        defaultJobOptions: ImmichDefaultJobOptions,
      },
      {
        name: QueueNameEnum.ASSET_UPLOADED,
        defaultJobOptions: ImmichDefaultJobOptions,
      },
      {
        name: QueueNameEnum.METADATA_EXTRACTION,
        defaultJobOptions: ImmichDefaultJobOptions,
      },
      {
        name: QueueNameEnum.VIDEO_CONVERSION,
        defaultJobOptions: ImmichDefaultJobOptions,
      },
      {
        name: QueueNameEnum.CHECKSUM_GENERATION,
        defaultJobOptions: ImmichDefaultJobOptions,
      },
      {
        name: QueueNameEnum.MACHINE_LEARNING,
        defaultJobOptions: ImmichDefaultJobOptions,
      },
      {
        name: QueueNameEnum.STORAGE_MIGRATION,
        defaultJobOptions: ImmichDefaultJobOptions,
      },
    ),
    CommunicationModule,
  ],
  controllers: [],
  providers: [
    MicroservicesService,
    AssetUploadedProcessor,
    ThumbnailGeneratorProcessor,
    MetadataExtractionProcessor,
    VideoTranscodeProcessor,
    GenerateChecksumProcessor,
    MachineLearningProcessor,
    UserDeletionProcessor,
    StorageMigrationProcessor,
  ],
  exports: [BullModule],
})
export class MicroservicesModule {}
