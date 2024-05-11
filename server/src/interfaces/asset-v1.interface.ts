import { AssetSearchDto, CheckExistingAssetsDto } from 'src/dtos/asset-v1.dto';
import { AssetEntity } from 'src/entities/asset.entity';

/** @deprecated */
export interface AssetCheck {
  id: string;
  checksum: Buffer;
}

/** @deprecated */
export interface AssetOwnerCheck extends AssetCheck {
  ownerId: string;
}

/** @deprecated */
export interface IAssetRepositoryV1 {
  get(id: string): Promise<AssetEntity | null>;
  getAllByUserId(userId: string, dto: AssetSearchDto): Promise<AssetEntity[]>;
  getAssetsByChecksums(userId: string, checksums: Buffer[]): Promise<AssetCheck[]>;
  getExistingAssets(userId: string, checkDuplicateAssetDto: CheckExistingAssetsDto): Promise<string[]>;
  getByOriginalPath(originalPath: string): Promise<AssetOwnerCheck | null>;
}

/** @deprecated */
export const IAssetRepositoryV1 = 'IAssetRepositoryV1';
