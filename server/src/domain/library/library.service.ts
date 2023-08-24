import { AssetType, LibraryEntity, LibraryType, UserEntity } from '@app/infra/entities';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { basename, parse } from 'path';

import { R_OK } from 'node:constants';
import { Stats } from 'node:fs';
import path from 'node:path';
import { AccessCore, IAccessRepository, Permission } from '../access';
import { IAssetRepository } from '../asset';
import { AuthUserDto } from '../auth';
import { ICryptoRepository } from '../crypto';
import { mimeTypes } from '../domain.constant';
import {
  IJobRepository,
  ILibraryFileJob,
  ILibraryJob,
  ILibraryRefreshJob,
  IOfflineLibraryFileJob,
  JobName,
} from '../job';
import { IStorageRepository } from '../storage';
import { IUserRepository } from '../user';
import {
  CreateLibraryDto,
  GetLibrariesDto,
  LibraryResponseDto,
  LibraryStatsResponseDto,
  mapLibrary,
  ScanLibraryDto as RefreshLibraryDto,
  UpdateLibraryDto,
} from './library.dto';
import { ILibraryRepository } from './library.repository';

@Injectable()
export class LibraryService {
  readonly logger = new Logger(LibraryService.name);
  private access: AccessCore;

  constructor(
    @Inject(IAccessRepository) private accessRepository: IAccessRepository,
    @Inject(IUserRepository) private userRepository: IUserRepository,
    @Inject(ILibraryRepository) private libraryRepository: ILibraryRepository,
    @Inject(IAssetRepository) private assetRepository: IAssetRepository,
    @Inject(IJobRepository) private jobRepository: IJobRepository,
    @Inject(ICryptoRepository) private cryptoRepository: ICryptoRepository,
    @Inject(IStorageRepository) private storageRepository: IStorageRepository,
  ) {
    this.access = new AccessCore(accessRepository);
  }

  async getCount(authUser: AuthUserDto): Promise<number> {
    return this.libraryRepository.getCountForUser(authUser.id);
  }

  async get(authUser: AuthUserDto, libraryId: string): Promise<LibraryResponseDto> {
    await this.access.requirePermission(authUser, Permission.LIBRARY_READ, libraryId);

    const library = await this.libraryRepository.get(libraryId);
    if (!library) {
      throw new NotFoundException('Library Not Found');
    }

    return mapLibrary(library);
  }

  async getStatistics(authUser: AuthUserDto, libraryId: string): Promise<LibraryStatsResponseDto> {
    await this.access.requirePermission(authUser, Permission.LIBRARY_READ, libraryId);
    return await this.libraryRepository.getStatistics(libraryId);
  }

  async create(authUser: AuthUserDto, dto: CreateLibraryDto): Promise<LibraryResponseDto> {
    const libraryEntity = await this.libraryRepository.create({
      owner: { id: authUser.id } as UserEntity,
      name: dto.name,
      assets: [],
      type: dto.type,
      importPaths: dto.importPaths,
      exclusionPatterns: dto.exclusionPatterns,
      isVisible: dto.isVisible ?? true,
    });

    return mapLibrary(libraryEntity);
  }

  async update(authUser: AuthUserDto, dto: UpdateLibraryDto): Promise<LibraryResponseDto> {
    await this.access.requirePermission(authUser, Permission.LIBRARY_UPDATE, dto.id);

    const updatedLibrary = await this.libraryRepository.update(dto);

    return mapLibrary(updatedLibrary);
  }

  async delete(authUser: AuthUserDto, id: string) {
    await this.access.requirePermission(authUser, Permission.LIBRARY_DELETE, id);

    const defaultUploadLibrary = await this.libraryRepository.getDefaultUploadLibrary(authUser.id);
    if (defaultUploadLibrary && defaultUploadLibrary.id == id) {
      throw new BadRequestException('Cannot delete the default upload library');
    }

    await this.libraryRepository.softDelete(id);

    this.jobRepository.queue({ name: JobName.DELETE_LIBRARY, data: { libraryId: id } });
  }

  async handleDeleteLibrary(job: ILibraryJob): Promise<boolean> {
    const library = await this.libraryRepository.getById(job.libraryId);
    if (!library) {
      throw new BadRequestException('Library not found');
    }
    const assetIds = await this.libraryRepository.getAssetIds(job.libraryId);
    this.logger.debug(`Will delete ${assetIds.length} asset(s) in library ${job.libraryId}`);

    await this.deleteLibraryFiles(assetIds);

    this.logger.log(`Deleting library ${job.libraryId}`);

    await this.libraryRepository.delete(job.libraryId);

    return true;
  }

  private async deleteLibraryFiles(assetIds: string[]) {
    for (const assetId of assetIds) {
      const asset = await this.assetRepository.getById(assetId);
      this.logger.debug(`Removing asset from library: ${asset.originalPath}`);

      if (asset.faces) {
        await Promise.all(
          asset.faces.map(({ assetId, personId }) =>
            this.jobRepository.queue({ name: JobName.SEARCH_REMOVE_FACE, data: { assetId, personId } }),
          ),
        );
      }

      await this.assetRepository.remove(asset);
      await this.jobRepository.queue({ name: JobName.SEARCH_REMOVE_ASSET, data: { ids: [asset.id] } });

      await this.jobRepository.queue({
        name: JobName.DELETE_FILES,
        data: { files: [asset.webpPath, asset.resizePath, asset.encodedVideoPath, asset.sidecarPath] },
      });

      // TODO refactor this to use cascades
      if (asset.livePhotoVideoId && !assetIds.includes(asset.livePhotoVideoId)) {
        assetIds.push(asset.livePhotoVideoId);
      }
    }
  }

  async getAll(authUser: AuthUserDto, dto: GetLibrariesDto): Promise<LibraryResponseDto[]> {
    this.access.requireUploadAccess(authUser);

    if (dto.assetId) {
      // TODO
      throw new BadRequestException('Not implemented yet');
    }
    const libraries = await this.libraryRepository.getAllByUserId(authUser.id);
    return libraries.map((library) => mapLibrary(library));
  }

  async getLibraryById(authUser: AuthUserDto, libraryId: string): Promise<LibraryResponseDto> {
    await this.access.requirePermission(authUser, Permission.LIBRARY_READ, libraryId);

    const libraryEntity = await this.libraryRepository.getById(libraryId);
    return mapLibrary(libraryEntity);
  }

  async handleAssetRefresh(job: ILibraryFileJob) {
    this.logger.verbose(`Refreshing library asset: ${job.assetPath}`);

    const user = await this.userRepository.get(job.ownerId);

    if (!user?.externalPath) {
      throw new BadRequestException("User has no external path set, can't import asset");
    }

    if (!path.normalize(job.assetPath).match(new RegExp(`^${user.externalPath}`))) {
      throw new BadRequestException("Asset must be within the user's external path");
    }

    const existingAssetEntity = await this.assetRepository.getByLibraryIdAndOriginalPath(job.libraryId, job.assetPath);

    let stats: Stats;
    try {
      stats = await this.storageRepository.stat(job.assetPath);
    } catch (error) {
      // Can't access file, probably offline
      if (existingAssetEntity) {
        // Mark asset as offline
        this.logger.debug(`Marking asset as offline: ${job.assetPath}`);

        await this.assetRepository.save({ id: existingAssetEntity.id, isOffline: true });
        return true;
      } else {
        // File can't be accessed and does not already exist in db
        throw new BadRequestException(error, "Can't access file");
      }
    }

    let doImport = false;

    if (job.analyze) {
      throw new BadRequestException('Asset re-reads are not implemented yet');

      // Analyze was requested, re-read from disk
      // doImport = true;
    }

    if (!existingAssetEntity) {
      // This asset is new to us, read it from disk
      this.logger.debug(`Importing new asset: ${job.assetPath}`);
      doImport = true;
    } else if (stats.mtime.toISOString() !== existingAssetEntity.fileModifiedAt.toISOString()) {
      // File modification time has changed since last time we checked, re-read from disk
      this.logger.debug(
        `File modification time has changed, re-importing asset: ${job.assetPath}. Old mtime: ${existingAssetEntity.fileModifiedAt}. New mtime: ${stats.mtime}`,
      );

      doImport = true;
    } else if (stats && !job.analyze && !existingAssetEntity.isOffline) {
      // Asset exists on disk and in db and mtime has not changed. Also, we are not forcing refresn. Therefore, do nothing
      this.logger.debug(`Asset already exists in database and on disk, will not import: ${job.assetPath}`);
      return true;
    }

    if (existingAssetEntity?.isOffline) {
      // File was previously offline but is now online
      this.logger.debug(`Marking previously-offline asset as online: ${job.assetPath}`);
      await this.assetRepository.save({ id: existingAssetEntity.id, isOffline: false });
    }

    if (!doImport) {
      // If we don't import, exit early
      return true;
    }

    let assetType: AssetType;

    if (mimeTypes.isImage(job.assetPath)) {
      assetType = AssetType.IMAGE;
    } else if (mimeTypes.isVideo(job.assetPath)) {
      assetType = AssetType.VIDEO;
    } else if (!mimeTypes.isAsset(job.assetPath)) {
      throw new BadRequestException(`Unsupported file type ${job.assetPath}`);
    } else {
      throw new BadRequestException(`Unknown error when checking file type of ${job.assetPath}`);
    }

    // TODO: doesn't xmp replace the file extension? Will need investigation
    let sidecarPath: string | null = null;
    try {
      await this.storageRepository.checkFileExists(`${job.assetPath}.xmp`, R_OK);
      sidecarPath = `${job.assetPath}.xmp`;
    } catch (error) {}

    const checksum = await this.cryptoRepository.hashFile(job.assetPath);
    const deviceAssetId = `${basename(job.assetPath)}-${stats.size}`.replace(/\s+/g, '');

    // TODO: In wait of refactoring the domain asset service, this function is just manually written like this
    const addedAsset = await this.assetRepository.create({
      owner: { id: job.ownerId } as UserEntity,

      library: { id: job.libraryId } as LibraryEntity,

      checksum: checksum,
      originalPath: job.assetPath,

      deviceAssetId: deviceAssetId,
      deviceId: 'Library Import',

      fileCreatedAt: stats.ctime,
      fileModifiedAt: stats.mtime,

      type: assetType,
      isFavorite: false,
      isArchived: false,
      duration: null,
      isVisible: true,
      livePhotoVideo: null,
      resizePath: null,
      webpPath: null,
      thumbhash: null,
      encodedVideoPath: null,
      tags: [],
      sharedLinks: [],
      originalFileName: parse(job.assetPath).name,
      faces: [],
      sidecarPath: sidecarPath,
      isReadOnly: true,
      isOffline: false,
    });

    this.logger.debug(`Queuing metadata extraction for: ${job.assetPath}`);

    await this.jobRepository.queue({
      name: JobName.METADATA_EXTRACTION,
      data: { id: addedAsset.id, source: 'upload' },
    });

    if (addedAsset.type === AssetType.VIDEO) {
      await this.jobRepository.queue({ name: JobName.VIDEO_CONVERSION, data: { id: addedAsset.id } });
    }

    return true;
  }

  async handleOfflineAsset(job: IOfflineLibraryFileJob): Promise<boolean> {
    const existingAssetEntity = await this.assetRepository.getByLibraryIdAndOriginalPath(job.libraryId, job.assetPath);

    if (job.emptyTrash && existingAssetEntity) {
      this.logger.verbose(`Removing offline asset: ${job.assetPath}`);

      await this.deleteLibraryFiles([job.assetId]);
    } else if (existingAssetEntity) {
      this.logger.verbose(`Marking asset as offline: ${job.assetPath}`);
      await this.assetRepository.save({ id: existingAssetEntity.id, isOffline: true });
    }

    return true;
  }

  async refresh(authUser: AuthUserDto, libraryId: string, dto: RefreshLibraryDto) {
    await this.access.requirePermission(authUser, Permission.LIBRARY_UPDATE, libraryId);

    const libraryRefreshJobData: ILibraryRefreshJob = {
      libraryId: libraryId,
      ownerId: authUser.id,
      analyze: dto.analyze ?? false,
      emptyTrash: dto.emptyTrash ?? false,
    };

    await this.jobRepository.queue({ name: JobName.REFRESH_LIBRARY, data: libraryRefreshJobData });
  }

  async handleLibraryRefresh(job: ILibraryRefreshJob): Promise<boolean> {
    const library = await this.libraryRepository.getById(job.libraryId);

    this.logger.verbose(`Refreshing library: ${job.libraryId}`);

    if (library.type != LibraryType.EXTERNAL) {
      Logger.error('Only imported libraries can be refreshed');
      throw new InternalServerErrorException('Only imported libraries can be refreshed');
    }

    const crawledAssetPaths = (
      await this.storageRepository.crawl({
        pathsToCrawl: library.importPaths,
        exclusionPatterns: library.exclusionPatterns,
      })
    ).map(path.normalize);

    this.logger.debug(`Found ${crawledAssetPaths.length} assets when crawling import paths ${library.importPaths}`);

    const assetsInLibrary = await this.assetRepository.getByLibraryId([job.libraryId]);

    const offlineAssets = assetsInLibrary.filter((asset) => !crawledAssetPaths.includes(asset.originalPath));

    this.logger.debug(`Found ${offlineAssets.length} offline assets in library ${job.libraryId}`);

    for (const offlineAsset of offlineAssets) {
      const offlineJobData: IOfflineLibraryFileJob = {
        assetPath: offlineAsset.originalPath,
        assetId: offlineAsset.id,
        libraryId: job.libraryId,
        emptyTrash: job.emptyTrash ?? false,
      };

      await this.jobRepository.queue({ name: JobName.OFFLINE_LIBRARY_ASSET, data: offlineJobData });
    }

    if (!job.emptyTrash && crawledAssetPaths.length > 0) {
      let filteredPaths: string[] = [];
      if (job.analyze) {
        filteredPaths = crawledAssetPaths;
      } else {
        const existingPaths = await this.libraryRepository.getAssetPaths(job.libraryId);
        this.logger.debug(`Found ${existingPaths.length} existing asset(s) in library ${job.libraryId}`);

        filteredPaths = crawledAssetPaths.filter((assetPath) => !existingPaths.includes(assetPath));
        this.logger.debug(`After db comparison, ${filteredPaths.length} asset(s) remain to be imported`);
      }

      for (const assetPath of filteredPaths) {
        const libraryJobData: ILibraryFileJob = {
          assetPath: path.normalize(assetPath),
          ownerId: job.ownerId,
          libraryId: job.libraryId,
          analyze: job.analyze ?? false,
          emptyTrash: job.emptyTrash ?? false,
        };

        await this.jobRepository.queue({ name: JobName.REFRESH_LIBRARY_ASSET, data: libraryJobData });
      }
    }

    return true;
  }
}
