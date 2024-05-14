import { IAssetRepository } from 'src/interfaces/asset.interface';
import { Mocked, vitest } from 'vitest';

export const newAssetRepositoryMock = (): Mocked<IAssetRepository> => {
  return {
    create: vitest.fn(),
    upsertExif: vitest.fn(),
    upsertJobStatus: vitest.fn(),
    getByDayOfYear: vitest.fn(),
    getByIds: vitest.fn().mockResolvedValue([]),
    getByIdsWithAllRelations: vitest.fn().mockResolvedValue([]),
    getByAlbumId: vitest.fn(),
    getByUserId: vitest.fn(),
    getById: vitest.fn(),
    getWithout: vitest.fn(),
    getByChecksum: vitest.fn(),
    getUploadAssetIdByChecksum: vitest.fn(),
    getWith: vitest.fn(),
    getRandom: vitest.fn(),
    getFirstAssetForAlbumId: vitest.fn(),
    getLastUpdatedAssetForAlbumId: vitest.fn(),
    getAll: vitest.fn().mockResolvedValue({ items: [], hasNextPage: false }),
    getAllByDeviceId: vitest.fn(),
    updateAll: vitest.fn(),
    getExternalLibraryAssetPaths: vitest.fn(),
    getByLibraryIdAndOriginalPath: vitest.fn(),
    deleteAll: vitest.fn(),
    update: vitest.fn(),
    remove: vitest.fn(),
    findLivePhotoMatch: vitest.fn(),
    getMapMarkers: vitest.fn(),
    getStatistics: vitest.fn(),
    getTimeBucket: vitest.fn(),
    getTimeBuckets: vitest.fn(),
    restoreAll: vitest.fn(),
    softDeleteAll: vitest.fn(),
    getAssetIdByCity: vitest.fn(),
    getAssetIdByTag: vitest.fn(),
    getAllForUserFullSync: vitest.fn(),
    getChangedDeltaSync: vitest.fn(),
  };
};
