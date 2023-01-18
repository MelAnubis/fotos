import { AssetEntity } from '@app/infra';
import { SmartInfoEntity } from '@app/infra';
import { QueueName, JobName } from '@app/domain';
import { IMachineLearningJob } from '@app/domain';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Job } from 'bull';
import { Repository } from 'typeorm';

const immich_machine_learning_url = process.env.IMMICH_MACHINE_LEARNING_URL || 'http://immich-machine-learning:3003';

@Processor(QueueName.MACHINE_LEARNING)
export class MachineLearningProcessor {
  constructor(
    @InjectRepository(SmartInfoEntity)
    private smartInfoRepository: Repository<SmartInfoEntity>,
  ) {}

  @Process({ name: JobName.IMAGE_TAGGING, concurrency: 2 })
  async tagImage(job: Job<IMachineLearningJob>) {
    const { asset } = job.data;

    const res = await axios.post(immich_machine_learning_url + '/image-classifier/tag-image', {
      thumbnailPath: asset.resizePath,
    });

    if (res.status == 201 && res.data.length > 0) {
      const smartInfo = new SmartInfoEntity();
      smartInfo.assetId = asset.id;
      smartInfo.tags = [...res.data];

      await this.smartInfoRepository.upsert(smartInfo, {
        conflictPaths: ['assetId'],
      });
    }
  }

  @Process({ name: JobName.OBJECT_DETECTION, concurrency: 2 })
  async detectObject(job: Job<IMachineLearningJob>) {
    try {
      const { asset }: { asset: AssetEntity } = job.data;

      const res = await axios.post(immich_machine_learning_url + '/object-detection/detect-object', {
        thumbnailPath: asset.resizePath,
      });

      if (res.status == 201 && res.data.length > 0) {
        const smartInfo = new SmartInfoEntity();
        smartInfo.assetId = asset.id;
        smartInfo.objects = [...res.data];

        await this.smartInfoRepository.upsert(smartInfo, {
          conflictPaths: ['assetId'],
        });
      }
    } catch (error) {
      Logger.error(`Failed to trigger object detection pipe line ${String(error)}`);
    }
  }
}
