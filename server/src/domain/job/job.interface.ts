import { BoundingBox } from '../smart-info';

export interface IBaseJob {
  force?: boolean;
}

export interface IAssetFaceJob extends IBaseJob {
  assetId: string;
  personId: string;
}

export interface IFaceThumbnailJob extends IAssetFaceJob {
  imageWidth: number;
  imageHeight: number;
  boundingBox: BoundingBox;
  assetId: string;
  personId: string;
}

export interface IPersonJob extends IBaseJob {
  personId: string;
  ownerId: string;
}

export interface IEntityJob extends IBaseJob {
  id: string;
  source?: 'upload';
  deleteOld?: boolean;
}

export interface IBulkEntityJob extends IBaseJob {
  ids: string[];
}

export interface IDeleteFilesJob extends IBaseJob {
  files: Array<string | null | undefined>;
}
