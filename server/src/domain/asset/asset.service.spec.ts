import { AssetEntity, AssetType } from '@app/infra/entities';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
  IAccessRepositoryMock,
  assetStub,
  authStub,
  faceStub,
  newAccessRepositoryMock,
  newAssetRepositoryMock,
  newCryptoRepositoryMock,
  newJobRepositoryMock,
  newStorageRepositoryMock,
  newSystemConfigRepositoryMock,
} from '@test';
import { when } from 'jest-when';
import { Readable } from 'stream';
import { ICryptoRepository } from '../crypto';
import { IJobRepository, JobItem, JobName } from '../job';
import { IStorageRepository } from '../storage';
import { ISystemConfigRepository } from '../system-config';
import { AssetStats, IAssetRepository, TimeBucketSize } from './asset.repository';
import { AssetService, UploadFieldName } from './asset.service';
import { AssetJobName, AssetStatsResponseDto, DownloadResponseDto } from './dto';
import { mapAsset } from './response-dto';

const downloadResponse: DownloadResponseDto = {
  totalSize: 105_000,
  archives: [
    {
      assetIds: ['asset-id', 'asset-id'],
      size: 105_000,
    },
  ],
};

const stats: AssetStats = {
  [AssetType.IMAGE]: 10,
  [AssetType.VIDEO]: 23,
  [AssetType.AUDIO]: 0,
  [AssetType.OTHER]: 0,
};

const statResponse: AssetStatsResponseDto = {
  images: 10,
  videos: 23,
  total: 33,
};

const uploadFile = {
  nullAuth: {
    authUser: null,
    fieldName: UploadFieldName.ASSET_DATA,
    file: {
      checksum: Buffer.from('checksum', 'utf8'),
      originalPath: 'upload/admin/image.jpeg',
      originalName: 'image.jpeg',
    },
  },
  filename: (fieldName: UploadFieldName, filename: string) => {
    return {
      authUser: authStub.admin,
      fieldName,
      file: {
        mimeType: 'image/jpeg',
        checksum: Buffer.from('checksum', 'utf8'),
        originalPath: `upload/admin/${filename}`,
        originalName: filename,
      },
    };
  },
};

const validImages = [
  '.3fr',
  '.ari',
  '.arw',
  '.avif',
  '.cap',
  '.cin',
  '.cr2',
  '.cr3',
  '.crw',
  '.dcr',
  '.dng',
  '.erf',
  '.fff',
  '.gif',
  '.heic',
  '.heif',
  '.iiq',
  '.jpeg',
  '.jpg',
  '.jxl',
  '.k25',
  '.kdc',
  '.mrw',
  '.nef',
  '.orf',
  '.ori',
  '.pef',
  '.png',
  '.psd',
  '.raf',
  '.raw',
  '.rwl',
  '.sr2',
  '.srf',
  '.srw',
  '.tiff',
  '.webp',
  '.x3f',
];

const validVideos = ['.3gp', '.avi', '.flv', '.m2ts', '.mkv', '.mov', '.mp4', '.mpg', '.mts', '.webm', '.wmv'];

const uploadTests = [
  {
    label: 'asset images',
    fieldName: UploadFieldName.ASSET_DATA,
    valid: validImages,
    invalid: ['.html', '.xml'],
  },
  {
    label: 'asset videos',
    fieldName: UploadFieldName.ASSET_DATA,
    valid: validVideos,
    invalid: ['.html', '.xml'],
  },
  {
    label: 'live photo',
    fieldName: UploadFieldName.LIVE_PHOTO_DATA,
    valid: validVideos,
    invalid: ['.html', '.jpeg', '.jpg', '.xml'],
  },
  {
    label: 'sidecar',
    fieldName: UploadFieldName.SIDECAR_DATA,
    valid: ['.xmp'],
    invalid: ['.html', '.jpeg', '.jpg', '.mov', '.mp4', '.xml'],
  },
  {
    label: 'profile',
    fieldName: UploadFieldName.PROFILE_DATA,
    valid: ['.avif', '.dng', '.heic', '.heif', '.jpeg', '.jpg', '.png', '.webp'],
    invalid: ['.arf', '.cr2', '.html', '.mov', '.mp4', '.xml'],
  },
];

describe(AssetService.name, () => {
  let sut: AssetService;
  let accessMock: IAccessRepositoryMock;
  let assetMock: jest.Mocked<IAssetRepository>;
  let cryptoMock: jest.Mocked<ICryptoRepository>;
  let jobMock: jest.Mocked<IJobRepository>;
  let storageMock: jest.Mocked<IStorageRepository>;
  let configMock: jest.Mocked<ISystemConfigRepository>;

  it('should work', () => {
    expect(sut).toBeDefined();
  });

  beforeEach(async () => {
    accessMock = newAccessRepositoryMock();
    assetMock = newAssetRepositoryMock();
    cryptoMock = newCryptoRepositoryMock();
    jobMock = newJobRepositoryMock();
    storageMock = newStorageRepositoryMock();
    configMock = newSystemConfigRepositoryMock();
    sut = new AssetService(accessMock, assetMock, cryptoMock, jobMock, configMock, storageMock);

    when(assetMock.getById)
      .calledWith(assetStub.livePhotoStillAsset.id)
      .mockResolvedValue(assetStub.livePhotoStillAsset as AssetEntity);
    when(assetMock.getById)
      .calledWith(assetStub.livePhotoMotionAsset.id)
      .mockResolvedValue(assetStub.livePhotoMotionAsset as AssetEntity);
  });

  describe('canUpload', () => {
    it('should require an authenticated user', () => {
      expect(() => sut.canUploadFile(uploadFile.nullAuth)).toThrowError(UnauthorizedException);
    });

    for (const { fieldName, valid, invalid } of uploadTests) {
      describe(fieldName, () => {
        for (const filetype of valid) {
          it(`should accept ${filetype}`, () => {
            expect(sut.canUploadFile(uploadFile.filename(fieldName, `asset${filetype}`))).toEqual(true);
          });
        }

        for (const filetype of invalid) {
          it(`should reject ${filetype}`, () => {
            expect(() => sut.canUploadFile(uploadFile.filename(fieldName, `asset${filetype}`))).toThrowError(
              BadRequestException,
            );
          });
        }

        it('should be sorted (valid)', () => {
          // TODO: use toSorted in NodeJS 20.
          expect(valid).toEqual([...valid].sort());
        });

        it('should be sorted (invalid)', () => {
          // TODO: use toSorted in NodeJS 20.
          expect(invalid).toEqual([...invalid].sort());
        });
      });
    }
  });

  describe('getUploadFilename', () => {
    it('should require authentication', () => {
      expect(() => sut.getUploadFilename(uploadFile.nullAuth)).toThrowError(UnauthorizedException);
    });

    it('should be the original extension for asset upload', () => {
      expect(sut.getUploadFilename(uploadFile.filename(UploadFieldName.ASSET_DATA, 'image.jpg'))).toEqual(
        'random-uuid.jpg',
      );
    });

    it('should be the mov extension for live photo upload', () => {
      expect(sut.getUploadFilename(uploadFile.filename(UploadFieldName.LIVE_PHOTO_DATA, 'image.mp4'))).toEqual(
        'random-uuid.mov',
      );
    });

    it('should be the xmp extension for sidecar upload', () => {
      expect(sut.getUploadFilename(uploadFile.filename(UploadFieldName.SIDECAR_DATA, 'image.html'))).toEqual(
        'random-uuid.xmp',
      );
    });

    it('should be the original extension for profile upload', () => {
      expect(sut.getUploadFilename(uploadFile.filename(UploadFieldName.PROFILE_DATA, 'image.jpg'))).toEqual(
        'random-uuid.jpg',
      );
    });
  });

  describe('getUploadFolder', () => {
    it('should require authentication', () => {
      expect(() => sut.getUploadFolder(uploadFile.nullAuth)).toThrowError(UnauthorizedException);
    });

    it('should return profile for profile uploads', () => {
      expect(sut.getUploadFolder(uploadFile.filename(UploadFieldName.PROFILE_DATA, 'image.jpg'))).toEqual(
        'upload/profile/admin_id',
      );
      expect(storageMock.mkdirSync).toHaveBeenCalledWith('upload/profile/admin_id');
    });

    it('should return upload for everything else', () => {
      expect(sut.getUploadFolder(uploadFile.filename(UploadFieldName.ASSET_DATA, 'image.jpg'))).toEqual(
        'upload/upload/admin_id',
      );
      expect(storageMock.mkdirSync).toHaveBeenCalledWith('upload/upload/admin_id');
    });
  });

  describe('getMapMarkers', () => {
    it('should get geo information of assets', async () => {
      assetMock.getMapMarkers.mockResolvedValue(
        [assetStub.withLocation].map((asset) => ({
          id: asset.id,

          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          lat: asset.exifInfo!.latitude!,

          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          lon: asset.exifInfo!.longitude!,
        })),
      );

      const markers = await sut.getMapMarkers(authStub.user1, {});

      expect(markers).toHaveLength(1);
      expect(markers[0]).toEqual({
        id: assetStub.withLocation.id,
        lat: 100,
        lon: 100,
      });
    });
  });

  describe('getMemoryLane', () => {
    it('should get pictures for each year', async () => {
      assetMock.getByDate.mockResolvedValue([]);

      await expect(sut.getMemoryLane(authStub.admin, { timestamp: new Date(2023, 5, 15), years: 10 })).resolves.toEqual(
        [],
      );

      expect(assetMock.getByDate).toHaveBeenCalledTimes(10);
      expect(assetMock.getByDate.mock.calls).toEqual([
        [authStub.admin.id, new Date('2022-06-15T00:00:00.000Z')],
        [authStub.admin.id, new Date('2021-06-15T00:00:00.000Z')],
        [authStub.admin.id, new Date('2020-06-15T00:00:00.000Z')],
        [authStub.admin.id, new Date('2019-06-15T00:00:00.000Z')],
        [authStub.admin.id, new Date('2018-06-15T00:00:00.000Z')],
        [authStub.admin.id, new Date('2017-06-15T00:00:00.000Z')],
        [authStub.admin.id, new Date('2016-06-15T00:00:00.000Z')],
        [authStub.admin.id, new Date('2015-06-15T00:00:00.000Z')],
        [authStub.admin.id, new Date('2014-06-15T00:00:00.000Z')],
        [authStub.admin.id, new Date('2013-06-15T00:00:00.000Z')],
      ]);
    });

    it('should keep hours from the date', async () => {
      assetMock.getByDate.mockResolvedValue([]);

      await expect(
        sut.getMemoryLane(authStub.admin, { timestamp: new Date(2023, 5, 15, 5), years: 2 }),
      ).resolves.toEqual([]);

      expect(assetMock.getByDate).toHaveBeenCalledTimes(2);
      expect(assetMock.getByDate.mock.calls).toEqual([
        [authStub.admin.id, new Date('2022-06-15T05:00:00.000Z')],
        [authStub.admin.id, new Date('2021-06-15T05:00:00.000Z')],
      ]);
    });

    it('should set the title correctly', async () => {
      when(assetMock.getByDate)
        .calledWith(authStub.admin.id, new Date('2022-06-15T00:00:00.000Z'))
        .mockResolvedValue([assetStub.image]);
      when(assetMock.getByDate)
        .calledWith(authStub.admin.id, new Date('2021-06-15T00:00:00.000Z'))
        .mockResolvedValue([assetStub.video]);

      await expect(sut.getMemoryLane(authStub.admin, { timestamp: new Date(2023, 5, 15), years: 2 })).resolves.toEqual([
        { title: '1 year since...', assets: [mapAsset(assetStub.image)] },
        { title: '2 years since...', assets: [mapAsset(assetStub.video)] },
      ]);

      expect(assetMock.getByDate).toHaveBeenCalledTimes(2);
      expect(assetMock.getByDate.mock.calls).toEqual([
        [authStub.admin.id, new Date('2022-06-15T00:00:00.000Z')],
        [authStub.admin.id, new Date('2021-06-15T00:00:00.000Z')],
      ]);
    });
  });

  describe('getTimeBuckets', () => {
    it("should return buckets if userId and albumId aren't set", async () => {
      assetMock.getTimeBuckets.mockResolvedValue([{ timeBucket: 'bucket', count: 1 }]);

      await expect(
        sut.getTimeBuckets(authStub.admin, {
          size: TimeBucketSize.DAY,
        }),
      ).resolves.toEqual(expect.arrayContaining([{ timeBucket: 'bucket', count: 1 }]));
      expect(assetMock.getTimeBuckets).toBeCalledWith({ size: TimeBucketSize.DAY, userId: authStub.admin.id });
    });
  });

  describe('getByTimeBucket', () => {
    it('should return the assets for a album time bucket if user has album.read', async () => {
      accessMock.album.hasOwnerAccess.mockResolvedValue(true);
      assetMock.getByTimeBucket.mockResolvedValue([assetStub.image]);

      await expect(
        sut.getByTimeBucket(authStub.admin, { size: TimeBucketSize.DAY, timeBucket: 'bucket', albumId: 'album-id' }),
      ).resolves.toEqual(expect.arrayContaining([expect.objectContaining({ id: 'asset-id' })]));

      expect(accessMock.album.hasOwnerAccess).toHaveBeenCalledWith(authStub.admin.id, 'album-id');
      expect(assetMock.getByTimeBucket).toBeCalledWith('bucket', {
        size: TimeBucketSize.DAY,
        timeBucket: 'bucket',
        albumId: 'album-id',
      });
    });

    it('should return the assets for a archive time bucket if user has archive.read', async () => {
      assetMock.getByTimeBucket.mockResolvedValue([assetStub.image]);

      await expect(
        sut.getByTimeBucket(authStub.admin, {
          size: TimeBucketSize.DAY,
          timeBucket: 'bucket',
          isArchived: true,
          userId: authStub.admin.id,
        }),
      ).resolves.toEqual(expect.arrayContaining([expect.objectContaining({ id: 'asset-id' })]));
      expect(assetMock.getByTimeBucket).toBeCalledWith('bucket', {
        size: TimeBucketSize.DAY,
        timeBucket: 'bucket',
        isArchived: true,
        userId: authStub.admin.id,
      });
    });

    it('should return the assets for a library time bucket if user has library.read', async () => {
      assetMock.getByTimeBucket.mockResolvedValue([assetStub.image]);

      await expect(
        sut.getByTimeBucket(authStub.admin, {
          size: TimeBucketSize.DAY,
          timeBucket: 'bucket',
          userId: authStub.admin.id,
        }),
      ).resolves.toEqual(expect.arrayContaining([expect.objectContaining({ id: 'asset-id' })]));
      expect(assetMock.getByTimeBucket).toBeCalledWith('bucket', {
        size: TimeBucketSize.DAY,
        timeBucket: 'bucket',
        userId: authStub.admin.id,
      });
    });
  });

  describe('downloadFile', () => {
    it('should require the asset.download permission', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(false);
      accessMock.asset.hasAlbumAccess.mockResolvedValue(false);
      accessMock.asset.hasPartnerAccess.mockResolvedValue(false);

      await expect(sut.downloadFile(authStub.admin, 'asset-1')).rejects.toBeInstanceOf(BadRequestException);

      expect(accessMock.asset.hasOwnerAccess).toHaveBeenCalledWith(authStub.admin.id, 'asset-1');
      expect(accessMock.asset.hasAlbumAccess).toHaveBeenCalledWith(authStub.admin.id, 'asset-1');
      expect(accessMock.asset.hasPartnerAccess).toHaveBeenCalledWith(authStub.admin.id, 'asset-1');
    });

    it('should throw an error if the asset is not found', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      assetMock.getByIds.mockResolvedValue([]);

      await expect(sut.downloadFile(authStub.admin, 'asset-1')).rejects.toBeInstanceOf(BadRequestException);

      expect(assetMock.getByIds).toHaveBeenCalledWith(['asset-1']);
    });

    it('should download a file', async () => {
      const stream = new Readable();

      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      assetMock.getByIds.mockResolvedValue([assetStub.image]);
      storageMock.createReadStream.mockResolvedValue({ stream });

      await expect(sut.downloadFile(authStub.admin, 'asset-1')).resolves.toEqual({ stream });

      expect(storageMock.createReadStream).toHaveBeenCalledWith(assetStub.image.originalPath, 'image/jpeg');
    });

    it('should download an archive', async () => {
      const archiveMock = {
        addFile: jest.fn(),
        finalize: jest.fn(),
        stream: new Readable(),
      };

      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      assetMock.getByIds.mockResolvedValue([assetStub.noResizePath, assetStub.noWebpPath]);
      storageMock.createZipStream.mockReturnValue(archiveMock);

      await expect(sut.downloadArchive(authStub.admin, { assetIds: ['asset-1', 'asset-2'] })).resolves.toEqual({
        stream: archiveMock.stream,
      });

      expect(archiveMock.addFile).toHaveBeenCalledTimes(2);
      expect(archiveMock.addFile).toHaveBeenNthCalledWith(1, 'upload/library/IMG_123.jpg', 'IMG_123.jpg');
      expect(archiveMock.addFile).toHaveBeenNthCalledWith(2, 'upload/library/IMG_456.jpg', 'IMG_456.jpg');
    });

    it('should handle duplicate file names', async () => {
      const archiveMock = {
        addFile: jest.fn(),
        finalize: jest.fn(),
        stream: new Readable(),
      };

      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      assetMock.getByIds.mockResolvedValue([assetStub.noResizePath, assetStub.noResizePath]);
      storageMock.createZipStream.mockReturnValue(archiveMock);

      await expect(sut.downloadArchive(authStub.admin, { assetIds: ['asset-1', 'asset-2'] })).resolves.toEqual({
        stream: archiveMock.stream,
      });

      expect(archiveMock.addFile).toHaveBeenCalledTimes(2);
      expect(archiveMock.addFile).toHaveBeenNthCalledWith(1, 'upload/library/IMG_123.jpg', 'IMG_123.jpg');
      expect(archiveMock.addFile).toHaveBeenNthCalledWith(2, 'upload/library/IMG_123.jpg', 'IMG_123+1.jpg');
    });
  });

  describe('getDownloadInfo', () => {
    it('should throw an error for an invalid dto', async () => {
      await expect(sut.getDownloadInfo(authStub.admin, {})).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should return a list of archives (assetIds)', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      assetMock.getByIds.mockResolvedValue([assetStub.image, assetStub.video]);

      const assetIds = ['asset-1', 'asset-2'];
      await expect(sut.getDownloadInfo(authStub.admin, { assetIds })).resolves.toEqual(downloadResponse);

      expect(assetMock.getByIds).toHaveBeenCalledWith(['asset-1', 'asset-2']);
    });

    it('should return a list of archives (albumId)', async () => {
      accessMock.album.hasOwnerAccess.mockResolvedValue(true);
      assetMock.getByAlbumId.mockResolvedValue({
        items: [assetStub.image, assetStub.video],
        hasNextPage: false,
      });

      await expect(sut.getDownloadInfo(authStub.admin, { albumId: 'album-1' })).resolves.toEqual(downloadResponse);

      expect(accessMock.album.hasOwnerAccess).toHaveBeenCalledWith(authStub.admin.id, 'album-1');
      expect(assetMock.getByAlbumId).toHaveBeenCalledWith({ take: 2500, skip: 0 }, 'album-1');
    });

    it('should return a list of archives (userId)', async () => {
      accessMock.library.hasOwnerAccess.mockResolvedValue(true);
      assetMock.getByUserId.mockResolvedValue({
        items: [assetStub.image, assetStub.video],
        hasNextPage: false,
      });

      await expect(sut.getDownloadInfo(authStub.admin, { userId: authStub.admin.id })).resolves.toEqual(
        downloadResponse,
      );

      expect(assetMock.getByUserId).toHaveBeenCalledWith({ take: 2500, skip: 0 }, authStub.admin.id, {
        isVisible: true,
      });
    });

    it('should split archives by size', async () => {
      accessMock.library.hasOwnerAccess.mockResolvedValue(true);

      assetMock.getByUserId.mockResolvedValue({
        items: [
          { ...assetStub.image, id: 'asset-1' },
          { ...assetStub.video, id: 'asset-2' },
          { ...assetStub.withLocation, id: 'asset-3' },
          { ...assetStub.noWebpPath, id: 'asset-4' },
        ],
        hasNextPage: false,
      });

      await expect(
        sut.getDownloadInfo(authStub.admin, {
          userId: authStub.admin.id,
          archiveSize: 30_000,
        }),
      ).resolves.toEqual({
        totalSize: 251_456,
        archives: [
          { assetIds: ['asset-1', 'asset-2'], size: 105_000 },
          { assetIds: ['asset-3', 'asset-4'], size: 146_456 },
        ],
      });
    });

    it('should include the video portion of a live photo', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      when(assetMock.getByIds)
        .calledWith([assetStub.livePhotoStillAsset.id])
        .mockResolvedValue([assetStub.livePhotoStillAsset]);
      when(assetMock.getByIds)
        .calledWith([assetStub.livePhotoMotionAsset.id])
        .mockResolvedValue([assetStub.livePhotoMotionAsset]);

      const assetIds = [assetStub.livePhotoStillAsset.id];
      await expect(sut.getDownloadInfo(authStub.admin, { assetIds })).resolves.toEqual({
        totalSize: 125_000,
        archives: [
          {
            assetIds: [assetStub.livePhotoStillAsset.id, assetStub.livePhotoMotionAsset.id],
            size: 125_000,
          },
        ],
      });
    });
  });

  describe('getStatistics', () => {
    it('should get the statistics for a user, excluding archived assets', async () => {
      assetMock.getStatistics.mockResolvedValue(stats);
      await expect(sut.getStatistics(authStub.admin, { isArchived: false })).resolves.toEqual(statResponse);
      expect(assetMock.getStatistics).toHaveBeenCalledWith(authStub.admin.id, { isArchived: false });
    });

    it('should get the statistics for a user for archived assets', async () => {
      assetMock.getStatistics.mockResolvedValue(stats);
      await expect(sut.getStatistics(authStub.admin, { isArchived: true })).resolves.toEqual(statResponse);
      expect(assetMock.getStatistics).toHaveBeenCalledWith(authStub.admin.id, { isArchived: true });
    });

    it('should get the statistics for a user for favorite assets', async () => {
      assetMock.getStatistics.mockResolvedValue(stats);
      await expect(sut.getStatistics(authStub.admin, { isFavorite: true })).resolves.toEqual(statResponse);
      expect(assetMock.getStatistics).toHaveBeenCalledWith(authStub.admin.id, { isFavorite: true });
    });

    it('should get the statistics for a user for all assets', async () => {
      assetMock.getStatistics.mockResolvedValue(stats);
      await expect(sut.getStatistics(authStub.admin, {})).resolves.toEqual(statResponse);
      expect(assetMock.getStatistics).toHaveBeenCalledWith(authStub.admin.id, {});
    });
  });

  describe('update', () => {
    it('should require asset write access for the id', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(false);
      await expect(sut.update(authStub.admin, 'asset-1', { isArchived: false })).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(assetMock.save).not.toHaveBeenCalled();
    });

    it('should update the asset', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      assetMock.save.mockResolvedValue(assetStub.image);
      await sut.update(authStub.admin, 'asset-1', { isFavorite: true });
      expect(assetMock.save).toHaveBeenCalledWith({ id: 'asset-1', isFavorite: true });
    });

    it('should update the exif description', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      assetMock.save.mockResolvedValue(assetStub.image);
      await sut.update(authStub.admin, 'asset-1', { description: 'Test description' });
      expect(assetMock.upsertExif).toHaveBeenCalledWith({ assetId: 'asset-1', description: 'Test description' });
    });
  });

  describe('updateAll', () => {
    it('should require asset write access for all ids', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(false);
      await expect(
        sut.updateAll(authStub.admin, {
          ids: ['asset-1'],
          isArchived: false,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should update all assets', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      await sut.updateAll(authStub.admin, { ids: ['asset-1', 'asset-2'], isArchived: true });
      expect(assetMock.updateAll).toHaveBeenCalledWith(['asset-1', 'asset-2'], { isArchived: true });
    });
  });

  describe('deleteAll', () => {
    it('should required asset delete access for all ids', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(false);
      await expect(
        sut.deleteAll(authStub.user1, {
          ids: ['asset-1'],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should force delete a batch of assets', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);

      await sut.deleteAll(authStub.user1, { ids: ['asset1', 'asset2'], force: true });

      expect(jobMock.queue.mock.calls).toEqual([
        [{ name: JobName.ASSET_DELETION, data: { id: 'asset1' } }],
        [{ name: JobName.ASSET_DELETION, data: { id: 'asset2' } }],
      ]);
    });

    it('should soft delete a batch of assets', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);

      await sut.deleteAll(authStub.user1, { ids: ['asset1', 'asset2'], force: false });

      expect(assetMock.softDeleteAll).toHaveBeenCalledWith(['asset1', 'asset2']);
      expect(jobMock.queue.mock.calls).toEqual([
        [
          {
            name: JobName.SEARCH_REMOVE_ASSET,
            data: { ids: ['asset1', 'asset2'] },
          },
        ],
      ]);
    });
  });

  describe('restoreAll', () => {
    it('should required asset restore access for all ids', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(false);
      await expect(
        sut.deleteAll(authStub.user1, {
          ids: ['asset-1'],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should restore a batch of assets', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);

      await sut.restoreAll(authStub.user1, { ids: ['asset1', 'asset2'] });

      expect(assetMock.restoreAll).toHaveBeenCalledWith(['asset1', 'asset2']);
      expect(jobMock.queue.mock.calls).toEqual([
        [
          {
            name: JobName.SEARCH_INDEX_ASSET,
            data: { ids: ['asset1', 'asset2'] },
          },
        ],
      ]);
    });
  });

  describe('handleAssetDeletion', () => {
    beforeEach(() => {
      when(jobMock.queue)
        .calledWith(
          expect.objectContaining({
            name: JobName.ASSET_DELETION,
          }),
        )
        .mockImplementation(async (item: JobItem) => {
          const jobData = (item as { data?: any })?.data || {};
          await sut.handleAssetDeletion(jobData);
        });
    });

    it('should remove faces', async () => {
      const assetWithFace = { ...(assetStub.image as AssetEntity), faces: [faceStub.face1, faceStub.mergeFace1] };

      when(assetMock.getById).calledWith(assetWithFace.id).mockResolvedValue(assetWithFace);

      await sut.handleAssetDeletion({ id: assetWithFace.id });

      expect(jobMock.queue.mock.calls).toEqual([
        [
          {
            name: JobName.SEARCH_REMOVE_FACE,
            data: { assetId: faceStub.face1.assetId, personId: faceStub.face1.personId },
          },
        ],
        [
          {
            name: JobName.SEARCH_REMOVE_FACE,
            data: { assetId: faceStub.mergeFace1.assetId, personId: faceStub.mergeFace1.personId },
          },
        ],
        [{ name: JobName.SEARCH_REMOVE_ASSET, data: { ids: [assetWithFace.id] } }],
        [
          {
            name: JobName.DELETE_FILES,
            data: {
              files: [
                assetWithFace.webpPath,
                assetWithFace.resizePath,
                assetWithFace.encodedVideoPath,
                assetWithFace.sidecarPath,
                assetWithFace.originalPath,
              ],
            },
          },
        ],
      ]);

      expect(assetMock.remove).toHaveBeenCalledWith(assetWithFace);
    });

    it('should not schedule delete-files job for readonly assets', async () => {
      when(assetMock.getById)
        .calledWith(assetStub.readOnly.id)
        .mockResolvedValue(assetStub.readOnly as AssetEntity);

      await sut.handleAssetDeletion({ id: assetStub.readOnly.id });

      expect(jobMock.queue.mock.calls).toEqual([
        [{ name: JobName.SEARCH_REMOVE_ASSET, data: { ids: [assetStub.readOnly.id] } }],
      ]);

      expect(assetMock.remove).toHaveBeenCalledWith(assetStub.readOnly);
    });

    it('should not process assets from external library without fromExternal flag', async () => {
      when(assetMock.getById)
        .calledWith(assetStub.external.id)
        .mockResolvedValue(assetStub.external as AssetEntity);

      await sut.handleAssetDeletion({ id: assetStub.external.id });

      expect(jobMock.queue).not.toBeCalled();
      expect(assetMock.remove).not.toBeCalled();
    });

    it('should process assets from external library with fromExternal flag', async () => {
      when(assetMock.getById)
        .calledWith(assetStub.external.id)
        .mockResolvedValue(assetStub.external as AssetEntity);

      await sut.handleAssetDeletion({ id: assetStub.external.id, fromExternal: true });

      expect(assetMock.remove).toHaveBeenCalledWith(assetStub.external);
      expect(jobMock.queue.mock.calls).toEqual([
        [{ name: JobName.SEARCH_REMOVE_ASSET, data: { ids: [assetStub.external.id] } }],
        [
          {
            name: JobName.DELETE_FILES,
            data: {
              files: [
                assetStub.external.webpPath,
                assetStub.external.resizePath,
                assetStub.external.encodedVideoPath,
                assetStub.external.sidecarPath,
              ],
            },
          },
        ],
      ]);
    });

    it('should delete a live photo', async () => {
      await sut.handleAssetDeletion({ id: assetStub.livePhotoStillAsset.id });

      expect(jobMock.queue.mock.calls).toEqual([
        [{ name: JobName.SEARCH_REMOVE_ASSET, data: { ids: [assetStub.livePhotoStillAsset.id] } }],
        [{ name: JobName.ASSET_DELETION, data: { id: assetStub.livePhotoMotionAsset.id } }],
        [{ name: JobName.SEARCH_REMOVE_ASSET, data: { ids: [assetStub.livePhotoMotionAsset.id] } }],
        [
          {
            name: JobName.DELETE_FILES,
            data: {
              files: [undefined, undefined, undefined, undefined, 'fake_path/asset_1.mp4'],
            },
          },
        ],
        [
          {
            name: JobName.DELETE_FILES,
            data: {
              files: [undefined, undefined, undefined, undefined, 'fake_path/asset_1.jpeg'],
            },
          },
        ],
      ]);
    });
  });

  describe('run', () => {
    it('should run the refresh metadata job', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      await sut.run(authStub.admin, { assetIds: ['asset-1'], name: AssetJobName.REFRESH_METADATA }),
        expect(jobMock.queue).toHaveBeenCalledWith({ name: JobName.METADATA_EXTRACTION, data: { id: 'asset-1' } });
    });

    it('should run the refresh thumbnails job', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      await sut.run(authStub.admin, { assetIds: ['asset-1'], name: AssetJobName.REGENERATE_THUMBNAIL }),
        expect(jobMock.queue).toHaveBeenCalledWith({ name: JobName.GENERATE_JPEG_THUMBNAIL, data: { id: 'asset-1' } });
    });

    it('should run the transcode video', async () => {
      accessMock.asset.hasOwnerAccess.mockResolvedValue(true);
      await sut.run(authStub.admin, { assetIds: ['asset-1'], name: AssetJobName.TRANSCODE_VIDEO }),
        expect(jobMock.queue).toHaveBeenCalledWith({ name: JobName.VIDEO_CONVERSION, data: { id: 'asset-1' } });
    });
  });
});
