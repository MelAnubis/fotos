import { AssetEntity, AssetType, ExifEntity } from '@app/infra/entities';
import { authStub } from './auth.stub';
import { fileStub } from './file.stub';
import { libraryStub } from './library.stub';
import { userStub } from './user.stub';

export const assetStub = {
  noResizePath: Object.freeze<AssetEntity>({
    id: 'asset-id',
    originalFileName: 'IMG_123',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    originalPath: 'upload/library/IMG_123.jpg',
    resizePath: null,
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.IMAGE,
    webpPath: '/uploads/user-id/webp/path.ext',
    thumbhash: Buffer.from('blablabla', 'base64'),
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isSkipMotion: false,
    duration: null,
    isVisible: true,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    tags: [],
    sharedLinks: [],
    faces: [],
    sidecarPath: null,
    isReadOnly: false,
    deletedAt: null,
    isOffline: false,
    isExternal: false,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
  }),
  noWebpPath: Object.freeze<AssetEntity>({
    id: 'asset-id',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    originalPath: 'upload/library/IMG_456.jpg',
    resizePath: '/uploads/user-id/thumbs/path.ext',
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.IMAGE,
    webpPath: null,
    thumbhash: Buffer.from('blablabla', 'base64'),
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isSkipMotion: false,
    duration: null,
    isVisible: true,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    tags: [],
    sharedLinks: [],
    originalFileName: 'IMG_456',
    faces: [],
    sidecarPath: null,
    isReadOnly: false,
    isOffline: false,
    isExternal: false,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    exifInfo: {
      fileSizeInByte: 123_000,
    } as ExifEntity,
    deletedAt: null,
  }),
  noThumbhash: Object.freeze<AssetEntity>({
    id: 'asset-id',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    originalPath: '/original/path.ext',
    resizePath: '/uploads/user-id/thumbs/path.ext',
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.IMAGE,
    webpPath: '/uploads/user-id/webp/path.ext',
    thumbhash: null,
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isReadOnly: false,
    isOffline: false,
    isSkipMotion: false,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    duration: null,
    isVisible: true,
    isExternal: false,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    tags: [],
    sharedLinks: [],
    originalFileName: 'asset-id.ext',
    faces: [],
    sidecarPath: null,
    deletedAt: null,
  }),
  primaryImage: Object.freeze<AssetEntity>({
    id: 'asset-id',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.admin,
    ownerId: 'admin-id',
    deviceId: 'device-id',
    originalPath: '/original/path.jpg',
    resizePath: '/uploads/admin-id/thumbs/path.jpg',
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.IMAGE,
    webpPath: '/uploads/admin-id/webp/path.ext',
    thumbhash: Buffer.from('blablabla', 'base64'),
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isReadOnly: false,
    isSkipMotion: false,
    duration: null,
    isVisible: true,
    isExternal: false,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    isOffline: false,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    tags: [],
    sharedLinks: [],
    originalFileName: 'asset-id.jpg',
    faces: [],
    deletedAt: null,
    sidecarPath: null,
    exifInfo: {
      fileSizeInByte: 5_000,
    } as ExifEntity,
  }),
  image: Object.freeze<AssetEntity>({
    id: 'asset-id',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    originalPath: '/original/path.jpg',
    resizePath: '/uploads/user-id/thumbs/path.jpg',
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.IMAGE,
    webpPath: '/uploads/user-id/webp/path.ext',
    thumbhash: Buffer.from('blablabla', 'base64'),
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isReadOnly: false,
    isSkipMotion: false,
    duration: null,
    isVisible: true,
    isExternal: false,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    isOffline: false,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    tags: [],
    sharedLinks: [],
    originalFileName: 'asset-id.jpg',
    faces: [],
    deletedAt: null,
    sidecarPath: null,
    exifInfo: {
      fileSizeInByte: 5_000,
    } as ExifEntity,
  }),
  external: Object.freeze<AssetEntity>({
    id: 'asset-id',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    originalPath: '/data/user1/photo.jpg',
    resizePath: '/uploads/user-id/thumbs/path.jpg',
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.IMAGE,
    webpPath: '/uploads/user-id/webp/path.ext',
    thumbhash: Buffer.from('blablabla', 'base64'),
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isReadOnly: false,
    isExternal: true,
    isSkipMotion: false,
    duration: null,
    isVisible: true,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    isOffline: false,
    libraryId: 'library-id',
    library: libraryStub.externalLibrary1,
    tags: [],
    sharedLinks: [],
    originalFileName: 'asset-id.jpg',
    faces: [],
    deletedAt: null,
    sidecarPath: null,
    exifInfo: {
      fileSizeInByte: 5_000,
    } as ExifEntity,
  }),
  offline: Object.freeze<AssetEntity>({
    id: 'asset-id',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    originalPath: '/original/path.jpg',
    resizePath: '/uploads/user-id/thumbs/path.jpg',
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.IMAGE,
    webpPath: '/uploads/user-id/webp/path.ext',
    thumbhash: Buffer.from('blablabla', 'base64'),
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isReadOnly: false,
    isExternal: false,
    isSkipMotion: false,
    duration: null,
    isVisible: true,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    isOffline: true,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    tags: [],
    sharedLinks: [],
    originalFileName: 'asset-id.jpg',
    faces: [],
    sidecarPath: null,
    exifInfo: {
      fileSizeInByte: 5_000,
    } as ExifEntity,
    deletedAt: null,
  }),
  image1: Object.freeze<AssetEntity>({
    id: 'asset-id-1',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    originalPath: '/original/path.ext',
    resizePath: '/uploads/user-id/thumbs/path.ext',
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.IMAGE,
    webpPath: '/uploads/user-id/webp/path.ext',
    thumbhash: Buffer.from('blablabla', 'base64'),
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    deletedAt: null,
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isReadOnly: false,
    duration: null,
    isVisible: true,
    isSkipMotion: false,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    isExternal: false,
    isOffline: false,
    tags: [],
    sharedLinks: [],
    originalFileName: 'asset-id.ext',
    faces: [],
    sidecarPath: null,
    exifInfo: {
      fileSizeInByte: 5_000,
    } as ExifEntity,
  }),
  imageFrom2015: Object.freeze<AssetEntity>({
    id: 'asset-id-1',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2015-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2015-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    originalPath: '/original/path.ext',
    resizePath: '/uploads/user-id/thumbs/path.ext',
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.IMAGE,
    webpPath: '/uploads/user-id/webp/path.ext',
    thumbhash: Buffer.from('blablabla', 'base64'),
    encodedVideoPath: null,
    createdAt: new Date('2015-02-23T05:06:29.716Z'),
    updatedAt: new Date('2015-02-23T05:06:29.716Z'),
    localDateTime: new Date('2015-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isExternal: false,
    isReadOnly: false,
    isOffline: false,
    isSkipMotion: false,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    duration: null,
    isVisible: true,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    tags: [],
    sharedLinks: [],
    originalFileName: 'asset-id.ext',
    faces: [],
    sidecarPath: null,
    exifInfo: {
      fileSizeInByte: 5_000,
    } as ExifEntity,
    deletedAt: null,
  }),
  video: Object.freeze<AssetEntity>({
    id: 'asset-id',
    originalFileName: 'asset-id.ext',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    originalPath: '/original/path.ext',
    resizePath: '/uploads/user-id/thumbs/path.ext',
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.VIDEO,
    webpPath: null,
    thumbhash: null,
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isReadOnly: false,
    isExternal: false,
    isOffline: false,
    isSkipMotion: false,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    duration: null,
    isVisible: true,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    tags: [],
    sharedLinks: [],
    faces: [],
    sidecarPath: null,
    exifInfo: {
      fileSizeInByte: 100_000,
    } as ExifEntity,
    deletedAt: null,
  }),
  livePhotoMotionAsset: Object.freeze({
    id: 'live-photo-motion-asset',
    originalPath: fileStub.livePhotoMotion.originalPath,
    ownerId: authStub.user1.id,
    type: AssetType.VIDEO,
    isVisible: false,
    fileModifiedAt: new Date('2022-06-19T23:41:36.910Z'),
    fileCreatedAt: new Date('2022-06-19T23:41:36.910Z'),
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    exifInfo: {
      fileSizeInByte: 100_000,
    },
  } as AssetEntity),

  livePhotoStillAsset: Object.freeze({
    id: 'live-photo-still-asset',
    originalPath: fileStub.livePhotoStill.originalPath,
    ownerId: authStub.user1.id,
    type: AssetType.IMAGE,
    livePhotoVideoId: 'live-photo-motion-asset',
    isVisible: true,
    fileModifiedAt: new Date('2022-06-19T23:41:36.910Z'),
    fileCreatedAt: new Date('2022-06-19T23:41:36.910Z'),
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    exifInfo: {
      fileSizeInByte: 25_000,
    },
  } as AssetEntity),

  withLocation: Object.freeze<AssetEntity>({
    id: 'asset-with-favorite-id',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    checksum: Buffer.from('file hash', 'utf8'),
    originalPath: '/original/path.ext',
    resizePath: '/uploads/user-id/thumbs/path.ext',
    sidecarPath: null,
    type: AssetType.IMAGE,
    webpPath: null,
    thumbhash: null,
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: false,
    isArchived: false,
    isReadOnly: false,
    isExternal: false,
    isOffline: false,
    isSkipMotion: false,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    duration: null,
    isVisible: true,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    tags: [],
    sharedLinks: [],
    originalFileName: 'asset-id.ext',
    faces: [],
    exifInfo: {
      latitude: 100,
      longitude: 100,
      fileSizeInByte: 23_456,
    } as ExifEntity,
    deletedAt: null,
  }),
  sidecar: Object.freeze<AssetEntity>({
    id: 'asset-id',
    deviceAssetId: 'device-asset-id',
    fileModifiedAt: new Date('2023-02-23T05:06:29.716Z'),
    fileCreatedAt: new Date('2023-02-23T05:06:29.716Z'),
    owner: userStub.user1,
    ownerId: 'user-id',
    deviceId: 'device-id',
    originalPath: '/original/path.ext',
    resizePath: '/uploads/user-id/thumbs/path.ext',
    thumbhash: null,
    checksum: Buffer.from('file hash', 'utf8'),
    type: AssetType.IMAGE,
    webpPath: null,
    encodedVideoPath: null,
    createdAt: new Date('2023-02-23T05:06:29.716Z'),
    updatedAt: new Date('2023-02-23T05:06:29.716Z'),
    localDateTime: new Date('2023-02-23T05:06:29.716Z'),
    isFavorite: true,
    isArchived: false,
    isReadOnly: false,
    isExternal: false,
    isOffline: false,
    isSkipMotion: false,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
    duration: null,
    isVisible: true,
    livePhotoVideo: null,
    livePhotoVideoId: null,
    tags: [],
    sharedLinks: [],
    originalFileName: 'asset-id.ext',
    faces: [],
    sidecarPath: '/original/path.ext.xmp',
    deletedAt: null,
  }),
  readOnly: Object.freeze({
    id: 'read-only-asset',
    isReadOnly: true,
    libraryId: 'library-id',
    library: libraryStub.uploadLibrary1,
  }),
};
