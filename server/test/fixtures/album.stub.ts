import { AlbumEntity, AssetOrder } from '@app/infra/entities';
import { assetStub } from './asset.stub';
import { authStub } from './auth.stub';
import { userStub } from './user.stub';

export const albumStub = {
  empty: Object.freeze<AlbumEntity>({
    id: 'album-1',
    albumName: 'Empty album',
    description: '',
    ownerId: authStub.admin.user.id,
    owner: userStub.admin,
    assets: [],
    albumThumbnailAsset: null,
    albumThumbnailAssetId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sharedLinks: [],
    sharedUsers: [],
    isActivityEnabled: true,
    order: AssetOrder.DESC,
  }),
  sharedWithUser: Object.freeze<AlbumEntity>({
    id: 'album-2',
    albumName: 'Empty album shared with user',
    description: '',
    ownerId: authStub.admin.user.id,
    owner: userStub.admin,
    assets: [],
    albumThumbnailAsset: null,
    albumThumbnailAssetId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sharedLinks: [],
    sharedUsers: [userStub.user1],
    isActivityEnabled: true,
    order: AssetOrder.DESC,
  }),
  sharedWithMultiple: Object.freeze<AlbumEntity>({
    id: 'album-3',
    albumName: 'Empty album shared with users',
    description: '',
    ownerId: authStub.admin.user.id,
    owner: userStub.admin,
    assets: [],
    albumThumbnailAsset: null,
    albumThumbnailAssetId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sharedLinks: [],
    sharedUsers: [userStub.user1, userStub.user2],
    isActivityEnabled: true,
    order: AssetOrder.DESC,
  }),
  sharedWithAdmin: Object.freeze<AlbumEntity>({
    id: 'album-3',
    albumName: 'Empty album shared with admin',
    description: '',
    ownerId: authStub.user1.user.id,
    owner: userStub.user1,
    assets: [],
    albumThumbnailAsset: null,
    albumThumbnailAssetId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sharedLinks: [],
    sharedUsers: [userStub.admin],
    isActivityEnabled: true,
    order: AssetOrder.DESC,
  }),
  oneAsset: Object.freeze<AlbumEntity>({
    id: 'album-4',
    albumName: 'Album with one asset',
    description: '',
    ownerId: authStub.admin.user.id,
    owner: userStub.admin,
    assets: [assetStub.image],
    albumThumbnailAsset: null,
    albumThumbnailAssetId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sharedLinks: [],
    sharedUsers: [],
    isActivityEnabled: true,
    order: AssetOrder.DESC,
  }),
  twoAssets: Object.freeze<AlbumEntity>({
    id: 'album-4a',
    albumName: 'Album with two assets',
    description: '',
    ownerId: authStub.admin.user.id,
    owner: userStub.admin,
    assets: [assetStub.image, assetStub.withLocation],
    albumThumbnailAsset: assetStub.image,
    albumThumbnailAssetId: assetStub.image.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sharedLinks: [],
    sharedUsers: [],
    isActivityEnabled: true,
    order: AssetOrder.DESC,
  }),
  emptyWithInvalidThumbnail: Object.freeze<AlbumEntity>({
    id: 'album-5',
    albumName: 'Empty album with invalid thumbnail',
    description: '',
    ownerId: authStub.admin.user.id,
    owner: userStub.admin,
    assets: [],
    albumThumbnailAsset: assetStub.image,
    albumThumbnailAssetId: assetStub.image.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sharedLinks: [],
    sharedUsers: [],
    isActivityEnabled: true,
    order: AssetOrder.DESC,
  }),
  emptyWithValidThumbnail: Object.freeze<AlbumEntity>({
    id: 'album-5',
    albumName: 'Empty album with invalid thumbnail',
    description: '',
    ownerId: authStub.admin.user.id,
    owner: userStub.admin,
    assets: [],
    albumThumbnailAsset: null,
    albumThumbnailAssetId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sharedLinks: [],
    sharedUsers: [],
    isActivityEnabled: true,
    order: AssetOrder.DESC,
  }),
  oneAssetInvalidThumbnail: Object.freeze<AlbumEntity>({
    id: 'album-6',
    albumName: 'Album with one asset and invalid thumbnail',
    description: '',
    ownerId: authStub.admin.user.id,
    owner: userStub.admin,
    assets: [assetStub.image],
    albumThumbnailAsset: assetStub.livePhotoMotionAsset,
    albumThumbnailAssetId: assetStub.livePhotoMotionAsset.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sharedLinks: [],
    sharedUsers: [],
    isActivityEnabled: true,
    order: AssetOrder.DESC,
  }),
  oneAssetValidThumbnail: Object.freeze<AlbumEntity>({
    id: 'album-6',
    albumName: 'Album with one asset and invalid thumbnail',
    description: '',
    ownerId: authStub.admin.user.id,
    owner: userStub.admin,
    assets: [assetStub.image],
    albumThumbnailAsset: assetStub.image,
    albumThumbnailAssetId: assetStub.image.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sharedLinks: [],
    sharedUsers: [],
    isActivityEnabled: true,
    order: AssetOrder.DESC,
  }),
};
