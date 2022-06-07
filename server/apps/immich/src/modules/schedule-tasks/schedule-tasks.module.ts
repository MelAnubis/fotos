import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModule } from '../../api-v1/asset/asset.module';
import { AssetEntity } from '@app/database/entities/asset.entity';
import { ImageConversionService } from './image-conversion.service';
import { VideoConversionProcessor } from './video-conversion.processor';
import { VideoConversionService } from './video-conversion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetEntity]),

    BullModule.registerQueue({
      settings: {},
      name: 'video-conversion',
      limiter: {
        max: 1,
        duration: 60000,
      },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),

    BullModule.registerQueue({
      name: 'thumbnail-generator-queue',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  providers: [ImageConversionService, VideoConversionService, VideoConversionProcessor],
})
export class ScheduleTasksModule {}
