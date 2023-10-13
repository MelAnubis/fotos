import { AssetPathType, DatabaseAction, PersonPathType, UserPathType } from '@app/infra/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import { resolve } from 'node:path';
import { JOBS_ASSET_PAGINATION_SIZE, usePagination } from '..';
import { AccessCore, Permission } from '../access';
import { AuthUserDto } from '../auth';
import { AUDIT_LOG_MAX_DURATION } from '../domain.constant';
import {
  IAccessRepository,
  IAssetRepository,
  IAuditRepository,
  ICryptoRepository,
  IPersonRepository,
  IStorageRepository,
  IUserRepository,
} from '../repositories';
import { StorageCore, StorageFolder } from '../storage';
import {
  AuditDeletesDto,
  AuditDeletesResponseDto,
  FileChecksumDto,
  FileChecksumResponseDto,
  FileReportItemDto,
  PathEntityType,
} from './audit.dto';

@Injectable()
export class AuditService {
  private access: AccessCore;
  private logger = new Logger(AuditService.name);

  constructor(
    @Inject(IAccessRepository) accessRepository: IAccessRepository,
    @Inject(IAssetRepository) private assetRepository: IAssetRepository,
    @Inject(ICryptoRepository) private cryptoRepository: ICryptoRepository,
    @Inject(IPersonRepository) private personRepository: IPersonRepository,
    @Inject(IAuditRepository) private repository: IAuditRepository,
    @Inject(IStorageRepository) private storageRepository: IStorageRepository,
    @Inject(IUserRepository) private userRepository: IUserRepository,
  ) {
    this.access = new AccessCore(accessRepository);
  }

  async handleCleanup(): Promise<boolean> {
    await this.repository.removeBefore(DateTime.now().minus(AUDIT_LOG_MAX_DURATION).toJSDate());
    return true;
  }

  async getDeletes(authUser: AuthUserDto, dto: AuditDeletesDto): Promise<AuditDeletesResponseDto> {
    const userId = dto.userId || authUser.id;
    await this.access.requirePermission(authUser, Permission.TIMELINE_READ, userId);

    const audits = await this.repository.getAfter(dto.after, {
      ownerId: userId,
      entityType: dto.entityType,
      action: DatabaseAction.DELETE,
    });

    const duration = DateTime.now().diff(DateTime.fromJSDate(dto.after));

    return {
      needsFullSync: duration > AUDIT_LOG_MAX_DURATION,
      ids: audits.map(({ entityId }) => entityId),
    };
  }

  async getChecksums(dto: FileChecksumDto) {
    const results: FileChecksumResponseDto[] = [];
    for (const filename of dto.filenames) {
      // TODO: security?
      const checksum = await this.cryptoRepository.hashFile(filename);
      results.push({ filename, checksum: checksum.toString('base64') });
    }
    return results;
  }

  async fixItems(items: FileReportItemDto[]) {
    for (const { entityId: id, pathType, pathValue } of items) {
      switch (pathType) {
        case AssetPathType.ENCODED_VIDEO:
          await this.assetRepository.save({ id, encodedVideoPath: pathValue });
          break;

        case AssetPathType.JPEG_THUMBNAIL:
          await this.assetRepository.save({ id, resizePath: pathValue });
          break;

        case AssetPathType.WEBP_THUMBNAIL:
          await this.assetRepository.save({ id, webpPath: pathValue });
          break;

        case AssetPathType.ORIGINAL:
          await this.assetRepository.save({ id, originalPath: pathValue });
          break;

        case AssetPathType.SIDECAR:
          await this.assetRepository.save({ id, sidecarPath: pathValue });
          break;

        case PersonPathType.FACE:
          await this.personRepository.update({ id, thumbnailPath: pathValue });
          break;

        case UserPathType.PROFILE:
          await this.userRepository.update(id, { profileImagePath: pathValue });
          break;
      }
    }
  }

  async getFileReport() {
    const fullPath = (filename: string) => resolve(filename);
    const hasFile = (items: Set<string>, filename: string) => items.has(filename) || items.has(fullPath(filename));
    const crawl = async (folder: StorageFolder) =>
      new Set(await this.storageRepository.crawl({ pathsToCrawl: [StorageCore.getBaseFolder(folder)] }));

    const libraryFiles = await crawl(StorageFolder.LIBRARY);
    const thumbFiles = await crawl(StorageFolder.THUMBNAILS);
    const videoFiles = await crawl(StorageFolder.ENCODED_VIDEO);
    const profileFiles = await crawl(StorageFolder.PROFILE);
    const allFiles = new Set<string>();
    for (const list of [libraryFiles, thumbFiles, videoFiles, profileFiles]) {
      for (const item of list) {
        allFiles.add(item);
      }
    }

    const track = (filename: string | null) => {
      if (!filename) {
        return;
      }
      allFiles.delete(filename);
      allFiles.delete(fullPath(filename));
    };

    this.logger.log(
      `Found ${libraryFiles.size} original files, ${thumbFiles.size} thumbnails, ${videoFiles.size} encoded videos, ${profileFiles.size} profile files`,
    );
    const pagination = usePagination(JOBS_ASSET_PAGINATION_SIZE, (options) =>
      this.assetRepository.getAll(options, { withDeleted: true }),
    );

    const orphans: FileReportItemDto[] = [];
    for await (const assets of pagination) {
      for (const { id, originalPath, resizePath, encodedVideoPath, webpPath, isExternal, checksum } of assets) {
        for (const file of [originalPath, resizePath, encodedVideoPath, webpPath]) {
          track(file);
        }

        const entity = { entityId: id, entityType: PathEntityType.ASSET, checksum: checksum.toString('base64') };
        if (
          originalPath &&
          !hasFile(libraryFiles, originalPath) &&
          // Android motion assets
          !hasFile(videoFiles, originalPath) &&
          // ignore external library assets
          !isExternal
        ) {
          orphans.push({ ...entity, pathType: AssetPathType.ORIGINAL, pathValue: originalPath });
        }
        if (resizePath && !hasFile(thumbFiles, resizePath)) {
          orphans.push({ ...entity, pathType: AssetPathType.JPEG_THUMBNAIL, pathValue: resizePath });
        }
        if (webpPath && !hasFile(thumbFiles, webpPath)) {
          orphans.push({ ...entity, pathType: AssetPathType.WEBP_THUMBNAIL, pathValue: webpPath });
        }
        if (encodedVideoPath && !hasFile(videoFiles, encodedVideoPath)) {
          orphans.push({ ...entity, pathType: AssetPathType.WEBP_THUMBNAIL, pathValue: encodedVideoPath });
        }
      }
    }

    const users = await this.userRepository.getList();
    for (const { id, profileImagePath } of users) {
      track(profileImagePath);

      const entity = { entityId: id, entityType: PathEntityType.USER };
      if (profileImagePath && !hasFile(profileFiles, profileImagePath)) {
        orphans.push({ ...entity, pathType: UserPathType.PROFILE, pathValue: profileImagePath });
      }
    }

    const people = await this.personRepository.getAll();
    for (const { id, thumbnailPath } of people) {
      track(thumbnailPath);
      const entity = { entityId: id, entityType: PathEntityType.PERSON };
      if (thumbnailPath && !hasFile(thumbFiles, thumbnailPath)) {
        orphans.push({ ...entity, pathType: PersonPathType.FACE, pathValue: thumbnailPath });
      }
    }

    const extras: string[] = [];
    for (const file of allFiles) {
      extras.push(file);
    }

    // send as absolute paths
    for (const orphan of orphans) {
      orphan.pathValue = fullPath(orphan.pathValue);
    }

    return { orphans, extras };
  }
}
