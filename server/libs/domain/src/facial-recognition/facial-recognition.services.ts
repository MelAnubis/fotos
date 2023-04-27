import { Inject, Logger } from '@nestjs/common';
import { join } from 'path';
import { IAssetRepository, WithoutProperty } from '../asset';
import { MACHINE_LEARNING_ENABLED } from '../domain.constant';
import { IAssetJob, IBaseJob, IFaceThumbnailJob, IJobRepository, JobName } from '../job';
import { IMediaRepository } from '../media';
import { IPeopleRepository } from '../people';
import { ISearchRepository } from '../search';
import { IMachineLearningRepository } from '../smart-info';
import { IStorageRepository, StorageCore, StorageFolder } from '../storage';
import { IFacialRecognitionRepository } from './facial-recognition.repository';

export class FacialRecognitionService {
  private logger = new Logger(FacialRecognitionService.name);
  private storageCore = new StorageCore();

  constructor(
    @Inject(IAssetRepository) private assetRepository: IAssetRepository,
    @Inject(IJobRepository) private jobRepository: IJobRepository,
    @Inject(IFacialRecognitionRepository) private repository: IFacialRecognitionRepository,
    @Inject(IMachineLearningRepository) private machineLearning: IMachineLearningRepository,
    @Inject(IMediaRepository) private mediaRepository: IMediaRepository,
    @Inject(ISearchRepository) private searchRepository: ISearchRepository,
    @Inject(IStorageRepository) private storageRepository: IStorageRepository,
    @Inject(IPeopleRepository) private peopleService: IPeopleRepository,
  ) {}

  async handleQueueRecognizeFaces({ force }: IBaseJob) {
    try {
      const assets = force
        ? await this.assetRepository.getAll()
        : await this.assetRepository.getWithout(WithoutProperty.FACES);

      for (const asset of assets) {
        await this.jobRepository.queue({ name: JobName.RECOGNIZE_FACES, data: { asset } });
      }
    } catch (error: any) {
      this.logger.error(`Unable to queue recognize faces`, error?.stack);
    }
  }

  async handleRecognizeFaces(data: IAssetJob) {
    const { asset } = data;

    if (!MACHINE_LEARNING_ENABLED || !asset.resizePath) {
      return;
    }

    try {
      const faces = await this.machineLearning.detectFaces({ thumbnailPath: asset.resizePath });

      this.logger.debug(`${faces.length} faces detected in ${asset.resizePath}`);
      this.logger.verbose(faces.map((face) => ({ ...face, embedding: `float[${face.embedding.length}]` })));

      if (faces.length > 0) {
        // TODO: delete all faces?
      }

      for (const { embedding, boundingBox } of faces) {
        // typesense magic here
        const faceSearchResult = await this.searchRepository.faceSearch(embedding);

        if (faceSearchResult.total) {
          this.logger.debug('Found face', faceSearchResult);
          continue;
        }

        this.logger.debug('No matches, creating a new person.');

        const person = await this.peopleService.create({ ownerId: asset.ownerId });
        await this.repository.createAssetFace({ embedding, assetId: asset.id, personId: person.id });

        await this.jobRepository.queue({
          name: JobName.GENERATE_FACE_THUMBNAIL,
          data: { assetId: asset.id, personId: person.id, boundingBox },
        });
      }
    } catch (error: any) {
      this.logger.error(`Unable run facial recognition pipeline: ${asset.id}`, error?.stack);
    }
  }

  async handleGenerateFaceThumbnail(data: IFaceThumbnailJob) {
    const { assetId, personId, boundingBox } = data;
    const { x1, y1, x2, y2 } = boundingBox;

    const [asset] = await this.assetRepository.getByIds([assetId]);
    if (!asset || !asset.resizePath) {
      this.logger.warn(`Asset not found for facial cropping: ${assetId}`);
      return null;
    }

    const outputFolder = this.storageCore.getFolderLocation(StorageFolder.THUMBNAILS, asset.ownerId);
    const output = join(outputFolder, `${personId}.jpeg`);
    this.storageRepository.mkdirSync(outputFolder);

    const left = x1 - 30 > 0 ? x1 - 30 : x1;
    const top = y1 - 30 > 0 ? y1 - 30 : y1;
    const width = x2 - x1 + 60;
    const height = y2 - y1 + 60;

    // TODO: move to machine learning code
    // if (left < 1 || top < 1 || width < 1 || height < 1) {
    //   this.logger.error(`invalid bounding box ${JSON.stringify(face.boundingBox)}`);
    //   return null;
    // }

    try {
      await this.mediaRepository.crop(asset.resizePath, output, { left, top, width, height });
      await this.peopleService.save({ id: personId, thumbnailPath: output });
    } catch (error: any) {
      this.logger.error(`Failed to crop face for asset: ${asset.id}`, error.stack);
    }
  }
}
