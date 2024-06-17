import { AssetFaceEntity } from 'src/entities/asset-face.entity';
import { assetStub } from 'test/fixtures/asset.stub';
import { personStub } from 'test/fixtures/person.stub';

type NonNullableProperty<T> = { [P in keyof T]: NonNullable<T[P]> };

export const faceStub = {
  face1: Object.freeze<NonNullableProperty<AssetFaceEntity>>({
    id: 'assetFaceId1',
    assetId: assetStub.image.id,
    asset: assetStub.image,
    personId: personStub.withName.id,
    person: personStub.withName,
    boundingBoxX1: 0,
    boundingBoxY1: 0,
    boundingBoxX2: 1,
    boundingBoxY2: 1,
    imageHeight: 1024,
    imageWidth: 1024,
    faceSearch: { faceId: 'assetFaceId1', embedding: [1, 2, 3, 4] },
  }),
  primaryFace1: Object.freeze<NonNullableProperty<AssetFaceEntity>>({
    id: 'assetFaceId2',
    assetId: assetStub.image.id,
    asset: assetStub.image,
    personId: personStub.primaryPerson.id,
    person: personStub.primaryPerson,
    boundingBoxX1: 0,
    boundingBoxY1: 0,
    boundingBoxX2: 1,
    boundingBoxY2: 1,
    imageHeight: 1024,
    imageWidth: 1024,
    faceSearch: { faceId: 'assetFaceId2', embedding: [1, 2, 3, 4] },
  }),
  mergeFace1: Object.freeze<NonNullableProperty<AssetFaceEntity>>({
    id: 'assetFaceId3',
    assetId: assetStub.image.id,
    asset: assetStub.image,
    personId: personStub.mergePerson.id,
    person: personStub.mergePerson,
    boundingBoxX1: 0,
    boundingBoxY1: 0,
    boundingBoxX2: 1,
    boundingBoxY2: 1,
    imageHeight: 1024,
    imageWidth: 1024,
    faceSearch: { faceId: 'assetFaceId3', embedding: [1, 2, 3, 4] },
  }),
  mergeFace2: Object.freeze<NonNullableProperty<AssetFaceEntity>>({
    id: 'assetFaceId4',
    assetId: assetStub.image1.id,
    asset: assetStub.image1,
    personId: personStub.mergePerson.id,
    person: personStub.mergePerson,
    boundingBoxX1: 0,
    boundingBoxY1: 0,
    boundingBoxX2: 1,
    boundingBoxY2: 1,
    imageHeight: 1024,
    imageWidth: 1024,
    faceSearch: { faceId: 'assetFaceId4', embedding: [1, 2, 3, 4] },
  }),
  start: Object.freeze<NonNullableProperty<AssetFaceEntity>>({
    id: 'assetFaceId5',
    assetId: assetStub.image.id,
    asset: assetStub.image,
    personId: personStub.newThumbnail.id,
    person: personStub.newThumbnail,
    boundingBoxX1: 5,
    boundingBoxY1: 5,
    boundingBoxX2: 505,
    boundingBoxY2: 505,
    imageHeight: 2880,
    imageWidth: 2160,
    faceSearch: { faceId: 'assetFaceId5', embedding: [1, 2, 3, 4] },
  }),
  middle: Object.freeze<NonNullableProperty<AssetFaceEntity>>({
    id: 'assetFaceId6',
    assetId: assetStub.image.id,
    asset: assetStub.image,
    personId: personStub.newThumbnail.id,
    person: personStub.newThumbnail,
    boundingBoxX1: 100,
    boundingBoxY1: 100,
    boundingBoxX2: 200,
    boundingBoxY2: 200,
    imageHeight: 500,
    imageWidth: 400,
    faceSearch: { faceId: 'assetFaceId6', embedding: [1, 2, 3, 4] },
  }),
  end: Object.freeze<NonNullableProperty<AssetFaceEntity>>({
    id: 'assetFaceId7',
    assetId: assetStub.image.id,
    asset: assetStub.image,
    personId: personStub.newThumbnail.id,
    person: personStub.newThumbnail,
    boundingBoxX1: 300,
    boundingBoxY1: 300,
    boundingBoxX2: 495,
    boundingBoxY2: 495,
    imageHeight: 500,
    imageWidth: 500,
    faceSearch: { faceId: 'assetFaceId7', embedding: [1, 2, 3, 4] },
  }),
  noPerson1: Object.freeze<AssetFaceEntity>({
    id: 'assetFaceId8',
    assetId: assetStub.image.id,
    asset: assetStub.image,
    personId: null,
    person: null,
    boundingBoxX1: 0,
    boundingBoxY1: 0,
    boundingBoxX2: 1,
    boundingBoxY2: 1,
    imageHeight: 1024,
    imageWidth: 1024,
    faceSearch: { faceId: 'assetFaceId8', embedding: [1, 2, 3, 4] },
  }),
  noPerson2: Object.freeze<AssetFaceEntity>({
    id: 'assetFaceId9',
    assetId: assetStub.image.id,
    asset: assetStub.image,
    personId: null,
    person: null,
    boundingBoxX1: 0,
    boundingBoxY1: 0,
    boundingBoxX2: 1,
    boundingBoxY2: 1,
    imageHeight: 1024,
    imageWidth: 1024,
    faceSearch: { faceId: 'assetFaceId9', embedding: [1, 2, 3, 4] },
  }),
};
