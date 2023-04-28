import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import {
  albumStub,
  assetEntityStub,
  asyncTick,
  authStub,
  newAlbumRepositoryMock,
  newAssetRepositoryMock,
  newJobRepositoryMock,
  newMachineLearningRepositoryMock,
  newPeopleRepositoryMock,
  newSearchRepositoryMock,
  searchStub,
} from '../../test';
import { IAlbumRepository } from '../album/album.repository';
import { IAssetRepository } from '../asset/asset.repository';
import { JobName } from '../job';
import { IJobRepository } from '../job/job.repository';
import { IPersonRepository } from '../people';
import { IMachineLearningRepository } from '../smart-info';
import { SearchDto } from './dto';
import { ISearchRepository } from './search.repository';
import { SearchService } from './search.service';

jest.useFakeTimers();

describe(SearchService.name, () => {
  let sut: SearchService;
  let albumMock: jest.Mocked<IAlbumRepository>;
  let assetMock: jest.Mocked<IAssetRepository>;
  let jobMock: jest.Mocked<IJobRepository>;
  let machineMock: jest.Mocked<IMachineLearningRepository>;
  let peopleMock: jest.Mocked<IPersonRepository>;
  let searchMock: jest.Mocked<ISearchRepository>;
  let configMock: jest.Mocked<ConfigService>;

  const makeSut = (value: string) => {
    configMock.get.mockReturnValue(value);
    return new SearchService(albumMock, assetMock, jobMock, machineMock, peopleMock, searchMock, configMock);
  };

  beforeEach(() => {
    albumMock = newAlbumRepositoryMock();
    assetMock = newAssetRepositoryMock();
    jobMock = newJobRepositoryMock();
    machineMock = newMachineLearningRepositoryMock();
    peopleMock = newPeopleRepositoryMock();
    searchMock = newSearchRepositoryMock();
    configMock = { get: jest.fn() } as unknown as jest.Mocked<ConfigService>;

    sut = new SearchService(albumMock, assetMock, jobMock, machineMock, peopleMock, searchMock, configMock);
  });

  afterEach(() => {
    sut.teardown();
  });

  it('should work', () => {
    expect(sut).toBeDefined();
  });

  describe('request dto', () => {
    it('should convert smartInfo.tags to a string list', () => {
      const instance = plainToInstance(SearchDto, { 'smartInfo.tags': 'a,b,c' });
      expect(instance['smartInfo.tags']).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty smartInfo.tags', () => {
      const instance = plainToInstance(SearchDto, {});
      expect(instance['smartInfo.tags']).toBeUndefined();
    });

    it('should convert smartInfo.objects to a string list', () => {
      const instance = plainToInstance(SearchDto, { 'smartInfo.objects': 'a,b,c' });
      expect(instance['smartInfo.objects']).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty smartInfo.objects', () => {
      const instance = plainToInstance(SearchDto, {});
      expect(instance['smartInfo.objects']).toBeUndefined();
    });
  });

  describe('isEnabled', () => {
    it('should be enabled by default', () => {
      expect(sut.isEnabled()).toBe(true);
    });

    it('should be disabled via an env variable', () => {
      const sut = makeSut('false');

      expect(sut.isEnabled()).toBe(false);
    });
  });

  describe('getConfig', () => {
    it('should return the config', () => {
      expect(sut.getConfig()).toEqual({ enabled: true });
    });

    it('should return the config when search is disabled', () => {
      const sut = makeSut('false');

      expect(sut.getConfig()).toEqual({ enabled: false });
    });
  });

  describe(`bootstrap`, () => {
    it('should skip when search is disabled', async () => {
      const sut = makeSut('false');

      await sut.bootstrap();

      expect(searchMock.setup).not.toHaveBeenCalled();
      expect(searchMock.checkMigrationStatus).not.toHaveBeenCalled();
      expect(jobMock.queue).not.toHaveBeenCalled();

      sut.teardown();
    });

    it('should skip schema migration if not needed', async () => {
      searchMock.checkMigrationStatus.mockResolvedValue({ assets: false, albums: false, faces: false });
      await sut.bootstrap();

      expect(searchMock.setup).toHaveBeenCalled();
      expect(jobMock.queue).not.toHaveBeenCalled();
    });

    it('should do schema migration if needed', async () => {
      searchMock.checkMigrationStatus.mockResolvedValue({ assets: true, albums: true, faces: true });
      await sut.bootstrap();

      expect(searchMock.setup).toHaveBeenCalled();
      expect(jobMock.queue.mock.calls).toEqual([
        [{ name: JobName.SEARCH_INDEX_ASSETS }],
        [{ name: JobName.SEARCH_INDEX_ALBUMS }],
      ]);
    });
  });

  describe('search', () => {
    it('should throw an error is search is disabled', async () => {
      const sut = makeSut('false');

      await expect(sut.search(authStub.admin, {})).rejects.toBeInstanceOf(BadRequestException);

      expect(searchMock.searchAlbums).not.toHaveBeenCalled();
      expect(searchMock.searchAssets).not.toHaveBeenCalled();
    });

    it('should search assets and albums', async () => {
      searchMock.searchAssets.mockResolvedValue(searchStub.emptyResults);
      searchMock.searchAlbums.mockResolvedValue(searchStub.emptyResults);
      searchMock.vectorSearch.mockResolvedValue(searchStub.emptyResults);

      await expect(sut.search(authStub.admin, {})).resolves.toEqual({
        albums: {
          total: 0,
          count: 0,
          page: 1,
          items: [],
          facets: [],
        },
        assets: {
          total: 0,
          count: 0,
          page: 1,
          items: [],
          facets: [],
        },
      });

      // expect(searchMock.searchAssets).toHaveBeenCalledWith('*', { userId: authStub.admin.id });
      expect(searchMock.searchAlbums).toHaveBeenCalledWith('*', { userId: authStub.admin.id });
    });
  });

  describe('handleIndexAssets', () => {
    it('should call done, even when there are no assets', async () => {
      assetMock.getAll.mockResolvedValue([]);

      await sut.handleIndexAssets();

      expect(searchMock.importAssets).toHaveBeenCalledWith([], true);
    });

    it('should index all the assets', async () => {
      assetMock.getAll.mockResolvedValue([assetEntityStub.image]);

      await sut.handleIndexAssets();

      expect(searchMock.importAssets.mock.calls).toEqual([
        [[assetEntityStub.image], false],
        [[], true],
      ]);
    });

    it('should log an error', async () => {
      assetMock.getAll.mockResolvedValue([assetEntityStub.image]);
      searchMock.importAssets.mockRejectedValue(new Error('import failed'));

      await sut.handleIndexAssets();

      expect(searchMock.importAssets).toHaveBeenCalled();
    });

    it('should skip if search is disabled', async () => {
      const sut = makeSut('false');

      await sut.handleIndexAssets();

      expect(searchMock.importAssets).not.toHaveBeenCalled();
      expect(searchMock.importAlbums).not.toHaveBeenCalled();
    });
  });

  describe('handleIndexAsset', () => {
    it('should skip if search is disabled', () => {
      const sut = makeSut('false');
      sut.handleIndexAsset({ ids: [assetEntityStub.image.id] });
    });

    it('should index the asset', () => {
      sut.handleIndexAsset({ ids: [assetEntityStub.image.id] });
    });
  });

  describe('handleIndexAlbums', () => {
    it('should skip if search is disabled', () => {
      const sut = makeSut('false');
      sut.handleIndexAlbums();
    });

    it('should index all the albums', async () => {
      albumMock.getAll.mockResolvedValue([albumStub.empty]);

      await sut.handleIndexAlbums();

      expect(searchMock.importAlbums).toHaveBeenCalledWith([albumStub.empty], true);
    });

    it('should log an error', async () => {
      albumMock.getAll.mockResolvedValue([albumStub.empty]);
      searchMock.importAlbums.mockRejectedValue(new Error('import failed'));

      await sut.handleIndexAlbums();

      expect(searchMock.importAlbums).toHaveBeenCalled();
    });
  });

  describe('handleIndexAlbum', () => {
    it('should skip if search is disabled', () => {
      const sut = makeSut('false');
      sut.handleIndexAlbum({ ids: [albumStub.empty.id] });
    });

    it('should index the album', () => {
      sut.handleIndexAlbum({ ids: [albumStub.empty.id] });
    });
  });

  describe('handleRemoveAlbum', () => {
    it('should skip if search is disabled', () => {
      const sut = makeSut('false');
      sut.handleRemoveAlbum({ ids: ['album1'] });
    });

    it('should remove the album', () => {
      sut.handleRemoveAlbum({ ids: ['album1'] });
    });
  });

  describe('handleRemoveAsset', () => {
    it('should skip if search is disabled', () => {
      const sut = makeSut('false');
      sut.handleRemoveAsset({ ids: ['asset1'] });
    });

    it('should remove the asset', () => {
      sut.handleRemoveAsset({ ids: ['asset1'] });
    });
  });

  describe('flush', () => {
    it('should flush queued album updates', async () => {
      albumMock.getByIds.mockResolvedValue([albumStub.empty]);

      sut.handleIndexAlbum({ ids: ['album1'] });

      jest.runOnlyPendingTimers();

      await asyncTick(4);

      expect(albumMock.getByIds).toHaveBeenCalledWith(['album1']);
      expect(searchMock.importAlbums).toHaveBeenCalledWith([albumStub.empty], false);
    });

    it('should flush queued album deletes', async () => {
      sut.handleRemoveAlbum({ ids: ['album1'] });

      jest.runOnlyPendingTimers();

      await asyncTick(4);

      expect(searchMock.deleteAlbums).toHaveBeenCalledWith(['album1']);
    });

    it('should flush queued asset updates', async () => {
      assetMock.getByIds.mockResolvedValue([assetEntityStub.image]);

      sut.handleIndexAsset({ ids: ['asset1'] });

      jest.runOnlyPendingTimers();

      await asyncTick(4);

      expect(assetMock.getByIds).toHaveBeenCalledWith(['asset1']);
      expect(searchMock.importAssets).toHaveBeenCalledWith([assetEntityStub.image], false);
    });

    it('should flush queued asset deletes', async () => {
      sut.handleRemoveAsset({ ids: ['asset1'] });

      jest.runOnlyPendingTimers();

      await asyncTick(4);

      expect(searchMock.deleteAssets).toHaveBeenCalledWith(['asset1']);
    });
  });
});
