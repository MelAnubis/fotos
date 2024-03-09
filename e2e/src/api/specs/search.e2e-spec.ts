import { AssetFileUploadResponseDto, LoginResponseDto, deleteAssets } from '@immich/sdk';
import { DateTime } from 'luxon';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Socket } from 'socket.io-client';
import { errorDto } from 'src/responses';
import { app, asBearerAuth, testAssetDir, utils } from 'src/utils';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const today = DateTime.now();

describe('/search', () => {
  let admin: LoginResponseDto;
  let websocket: Socket;

  let assetFalcon: AssetFileUploadResponseDto;
  let assetDenali: AssetFileUploadResponseDto;
  let assetCyclamen: AssetFileUploadResponseDto;
  let assetNotocactus: AssetFileUploadResponseDto;
  let assetSilver: AssetFileUploadResponseDto;
  // let assetDensity: AssetFileUploadResponseDto;
  // let assetPhiladelphia: AssetFileUploadResponseDto;
  // let assetOrychophragmus: AssetFileUploadResponseDto;
  // let assetRidge: AssetFileUploadResponseDto;
  // let assetPolemonium: AssetFileUploadResponseDto;
  // let assetWood: AssetFileUploadResponseDto;
  let assetHeic: AssetFileUploadResponseDto;
  let assetRocks: AssetFileUploadResponseDto;
  let assetOneJpg6: AssetFileUploadResponseDto;
  let assetOneHeic6: AssetFileUploadResponseDto;
  let assetOneJpg5: AssetFileUploadResponseDto;
  let assetGlarus: AssetFileUploadResponseDto;
  let assetSprings: AssetFileUploadResponseDto;
  let assetLast: AssetFileUploadResponseDto;

  beforeAll(async () => {
    await utils.resetDatabase();
    admin = await utils.adminSetup();
    websocket = await utils.connectWebsocket(admin.accessToken);

    const files = [
      { filename: '/albums/nature/prairie_falcon.jpg' },
      { filename: '/formats/webp/denali.webp' },
      { filename: '/albums/nature/cyclamen_persicum.jpg', dto: { isFavorite: true } },
      { filename: '/albums/nature/notocactus_minimus.jpg' },
      { filename: '/albums/nature/silver_fir.jpg' },
      { filename: '/formats/heic/IMG_2682.heic' },
      { filename: '/formats/jpg/el_torcal_rocks.jpg' },
      { filename: '/formats/motionphoto/Samsung One UI 6.jpg' },
      { filename: '/formats/motionphoto/Samsung One UI 6.heic' },
      { filename: '/formats/motionphoto/Samsung One UI 5.jpg' },
      { filename: '/formats/raw/Nikon/D80/glarus.nef', dto: { isReadOnly: true } },
      { filename: '/metadata/gps-position/thompson-springs.jpg', dto: { isArchived: true } },

      // used for search suggestions
      { filename: '/formats/png/density_plot.png' },
      { filename: '/formats/raw/Nikon/D700/philadelphia.nef' },
      { filename: '/albums/nature/orychophragmus_violaceus.jpg' },
      { filename: '/albums/nature/tanners_ridge.jpg' },
      { filename: '/albums/nature/polemonium_reptans.jpg' },

      // last asset
      { filename: '/albums/nature/wood_anemones.jpg' },
    ];
    const assets: AssetFileUploadResponseDto[] = [];
    for (const { filename, dto } of files) {
      const bytes = await readFile(join(testAssetDir, filename));
      assets.push(
        await utils.createAsset(admin.accessToken, {
          deviceAssetId: `test-${filename}`,
          assetData: { bytes, filename },
          ...dto,
        }),
      );
    }

    for (const asset of assets) {
      await utils.waitForWebsocketEvent({ event: 'upload', id: asset.id });
    }

    [
      assetFalcon,
      assetDenali,
      assetCyclamen,
      assetNotocactus,
      assetSilver,
      assetHeic,
      assetRocks,
      assetOneJpg6,
      assetOneHeic6,
      assetOneJpg5,
      assetGlarus,
      assetSprings,
      // assetDensity,
      // assetPhiladelphia,
      // assetOrychophragmus,
      // assetRidge,
      // assetPolemonium,
      // assetWood,
    ] = assets;

    assetLast = assets.at(-1) as AssetFileUploadResponseDto;

    await deleteAssets({ assetBulkDeleteDto: { ids: [assetSilver.id] } }, { headers: asBearerAuth(admin.accessToken) });
  });

  afterAll(async () => {
    await utils.disconnectWebsocket(websocket);
  });

  describe('POST /search/metadata', () => {
    it('should require authentication', async () => {
      const { status, body } = await request(app).post('/search/metadata');
      expect(status).toBe(401);
      expect(body).toEqual(errorDto.unauthorized);
    });

    const badTests = [
      {
        should: 'should reject page as a string',
        dto: { page: 'abc' },
        expected: ['page must not be less than 1', 'page must be an integer number'],
      },
      {
        should: 'should reject page as a decimal',
        dto: { page: 1.5 },
        expected: ['page must be an integer number'],
      },
      {
        should: 'should reject page as a negative number',
        dto: { page: -10 },
        expected: ['page must not be less than 1'],
      },
      {
        should: 'should reject page as 0',
        dto: { page: 0 },
        expected: ['page must not be less than 1'],
      },
      {
        should: 'should reject size as a string',
        dto: { size: 'abc' },
        expected: [
          'size must not be greater than 1000',
          'size must not be less than 1',
          'size must be an integer number',
        ],
      },
      {
        should: 'should reject an invalid size',
        dto: { size: -1.5 },
        expected: ['size must not be less than 1', 'size must be an integer number'],
      },
      ...[
        'isArchived',
        'isFavorite',
        'isReadOnly',
        'isExternal',
        'isEncoded',
        'isMotion',
        'isOffline',
        'isVisible',
      ].map((value) => ({
        should: `should reject ${value} not a boolean`,
        dto: { [value]: 'immich' },
        expected: [`${value} must be a boolean value`],
      })),
    ];

    for (const { should, dto, expected } of badTests) {
      it(should, async () => {
        const { status, body } = await request(app)
          .post('/search/metadata')
          .set('Authorization', `Bearer ${admin.accessToken}`)
          .send(dto);
        expect(status).toBe(400);
        expect(body).toEqual(errorDto.badRequest(expected));
      });
    }

    const searchTests = [
      {
        should: 'should get my assets',
        deferred: () => ({ dto: { size: 1 }, assets: [assetLast] }),
      },
      {
        should: 'should sort my assets in reverse',
        deferred: () => ({ dto: { order: 'asc', size: 2 }, assets: [assetCyclamen, assetNotocactus] }),
      },
      {
        should: 'should support pagination',
        deferred: () => ({ dto: { order: 'asc', size: 1, page: 2 }, assets: [assetNotocactus] }),
      },
      {
        should: 'should search by checksum (base64)',
        deferred: () => ({ dto: { checksum: '9IXBDMjj9OrQb+1YMHprZJgZ/UQ=' }, assets: [assetCyclamen] }),
      },
      {
        should: 'should search by checksum (hex)',
        deferred: () => ({ dto: { checksum: 'f485c10cc8e3f4ead06fed58307a6b649819fd44' }, assets: [assetCyclamen] }),
      },
      { should: 'should search by id', deferred: () => ({ dto: { id: assetCyclamen.id }, assets: [assetCyclamen] }) },
      {
        should: 'should search by isFavorite (true)',
        deferred: () => ({ dto: { isFavorite: true }, assets: [assetCyclamen] }),
      },
      {
        should: 'should search by isFavorite (false)',
        deferred: () => ({ dto: { size: 1, isFavorite: false }, assets: [assetLast] }),
      },
      {
        should: 'should search by isArchived (true)',
        deferred: () => ({ dto: { isArchived: true }, assets: [assetSprings] }),
      },
      {
        should: 'should search by isArchived (false)',
        deferred: () => ({ dto: { size: 1, isArchived: false }, assets: [assetLast] }),
      },
      {
        should: 'should search by isReadOnly (true)',
        deferred: () => ({ dto: { isReadOnly: true }, assets: [assetGlarus] }),
      },
      {
        should: 'should search by isReadOnly (false)',
        deferred: () => ({ dto: { size: 1, isReadOnly: false }, assets: [assetLast] }),
      },
      {
        should: 'should search by type (image)',
        deferred: () => ({ dto: { size: 1, type: 'IMAGE' }, assets: [assetLast] }),
      },
      {
        should: 'should search by type (video)',
        deferred: () => ({
          dto: { type: 'VIDEO' },
          assets: [
            // the three live motion photos
            { id: expect.any(String) },
            { id: expect.any(String) },
            { id: expect.any(String) },
          ],
        }),
      },
      {
        should: 'should search by trashedBefore',
        deferred: () => ({ dto: { trashedBefore: today.plus({ hour: 1 }).toJSDate() }, assets: [assetSilver] }),
      },
      {
        should: 'should search by trashedBefore (no results)',
        deferred: () => ({ dto: { trashedBefore: today.minus({ days: 1 }).toJSDate() }, assets: [] }),
      },
      {
        should: 'should search by trashedAfter',
        deferred: () => ({ dto: { trashedAfter: today.minus({ hour: 1 }).toJSDate() }, assets: [assetSilver] }),
      },
      {
        should: 'should search by trashedAfter (no results)',
        deferred: () => ({ dto: { trashedAfter: today.plus({ hour: 1 }).toJSDate() }, assets: [] }),
      },
      {
        should: 'should search by takenBefore',
        deferred: () => ({ dto: { size: 1, takenBefore: today.plus({ hour: 1 }).toJSDate() }, assets: [assetLast] }),
      },
      {
        should: 'should search by takenBefore (no results)',
        deferred: () => ({ dto: { takenBefore: DateTime.fromObject({ year: 1234 }).toJSDate() }, assets: [] }),
      },
      {
        should: 'should search by takenAfter',
        deferred: () => ({
          dto: { size: 1, takenAfter: DateTime.fromObject({ year: 1234 }).toJSDate() },
          assets: [assetLast],
        }),
      },
      {
        should: 'should search by takenAfter (no results)',
        deferred: () => ({ dto: { takenAfter: today.plus({ hour: 1 }).toJSDate() }, assets: [] }),
      },
      //   {
      //     should: 'should search by originalPath',
      //     deferred: () => ({
      //       dto: { originalPath: asset1.originalPath },
      //       assets: [asset1],
      //     }),
      //   },
      {
        should: 'should search by originalFilename',
        deferred: () => ({
          dto: { originalFileName: 'rocks' },
          assets: [assetRocks],
        }),
      },
      {
        should: 'should search by originalFilename with spaces',
        deferred: () => ({
          dto: { originalFileName: 'Samsung One', type: 'IMAGE' },
          assets: [assetOneJpg5, assetOneJpg6, assetOneHeic6],
        }),
      },
      {
        should: 'should search by city',
        deferred: () => ({ dto: { city: 'Ralston' }, assets: [assetHeic] }),
      },
      {
        should: 'should search by state',
        deferred: () => ({ dto: { state: 'Douglas County, Nebraska' }, assets: [assetHeic] }),
      },
      {
        should: 'should search by country',
        deferred: () => ({ dto: { country: 'United States of America' }, assets: [assetHeic] }),
      },
      {
        should: 'should search by make',
        deferred: () => ({ dto: { make: 'Canon' }, assets: [assetFalcon, assetDenali] }),
      },
      {
        should: 'should search by model',
        deferred: () => ({ dto: { model: 'Canon EOS 7D' }, assets: [assetDenali] }),
      },
    ];

    for (const { should, deferred } of searchTests) {
      it(should, async () => {
        const { assets, dto } = deferred();
        const { status, body } = await request(app)
          .post('/search/metadata')
          .send(dto)
          .set('Authorization', `Bearer ${admin.accessToken}`);
        console.dir({ status, body }, { depth: 10 });
        expect(status).toBe(200);
        expect(body.assets).toBeDefined();
        expect(Array.isArray(body.assets.items)).toBe(true);
        console.log({ assets: body.assets.items });
        for (const [i, asset] of assets.entries()) {
          expect(body.assets.items[i]).toEqual(expect.objectContaining({ id: asset.id }));
        }
        expect(body.assets.items).toHaveLength(assets.length);
      });
    }
  });

  describe('POST /search/smart', () => {
    it('should require authentication', async () => {
      const { status, body } = await request(app).post('/search/smart');
      expect(status).toBe(401);
      expect(body).toEqual(errorDto.unauthorized);
    });
  });

  describe('GET /search/explore', () => {
    it('should require authentication', async () => {
      const { status, body } = await request(app).get('/search/explore');
      expect(status).toBe(401);
      expect(body).toEqual(errorDto.unauthorized);
    });

    it('should get explore data', async () => {
      const { status, body } = await request(app)
        .get('/search/explore')
        .set('Authorization', `Bearer ${admin.accessToken}`);
      expect(status).toBe(200);
      expect(body).toEqual([
        { fieldName: 'exifInfo.city', items: [] },
        { fieldName: 'smartInfo.tags', items: [] },
      ]);
    });
  });

  describe('GET /search/places', () => {
    it('should require authentication', async () => {
      const { status, body } = await request(app).get('/search/places');
      expect(status).toBe(401);
      expect(body).toEqual(errorDto.unauthorized);
    });

    it('should get places', async () => {
      const { status, body } = await request(app)
        .get('/search/places?name=Paris')
        .set('Authorization', `Bearer ${admin.accessToken}`);
      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(10);
    });
  });

  describe('GET /search/suggestions', () => {
    it('should require authentication', async () => {
      const { status, body } = await request(app).get('/search/suggestions');
      expect(status).toBe(401);
      expect(body).toEqual(errorDto.unauthorized);
    });

    it('should get suggestions for country', async () => {
      const { status, body } = await request(app)
        .get('/search/suggestions?type=country')
        .set('Authorization', `Bearer ${admin.accessToken}`);
      expect(body).toEqual(['United States of America']);
      expect(status).toBe(200);
    });

    it('should get suggestions for state', async () => {
      const { status, body } = await request(app)
        .get('/search/suggestions?type=state')
        .set('Authorization', `Bearer ${admin.accessToken}`);
      expect(body).toEqual(['Douglas County, Nebraska', 'Mesa County, Colorado']);
      expect(status).toBe(200);
    });

    it('should get suggestions for city', async () => {
      const { status, body } = await request(app)
        .get('/search/suggestions?type=city')
        .set('Authorization', `Bearer ${admin.accessToken}`);
      expect(body).toEqual(['Palisade', 'Ralston']);
      expect(status).toBe(200);
    });

    it('should get suggestions for camera make', async () => {
      const { status, body } = await request(app)
        .get('/search/suggestions?type=camera-make')
        .set('Authorization', `Bearer ${admin.accessToken}`);
      expect(body).toEqual([
        'Apple',
        'Canon',
        'FUJIFILM',
        'NIKON CORPORATION',
        'PENTAX Corporation',
        'samsung',
        'SONY',
      ]);
      expect(status).toBe(200);
    });

    it('should get suggestions for camera model', async () => {
      const { status, body } = await request(app)
        .get('/search/suggestions?type=camera-model')
        .set('Authorization', `Bearer ${admin.accessToken}`);
      expect(body).toEqual([
        'Canon EOS 7D',
        'Canon EOS R5',
        'DSLR-A550',
        'FinePix S3Pro',
        'iPhone 7',
        'NIKON D700',
        'NIKON D750',
        'NIKON D80',
        'PENTAX K10D',
        'SM-F711N',
        'SM-S906U',
        'SM-T970',
      ]);
      expect(status).toBe(200);
    });
  });
});
