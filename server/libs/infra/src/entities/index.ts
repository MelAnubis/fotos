import { AlbumEntity } from './album.entity';
import { APIKeyEntity } from './api-key.entity';
import { AssetFaceEntity } from './asset-face.entity';
import { AssetEntity } from './asset.entity';
import { PersonEntity } from './person.entity';
import { SharedLinkEntity } from './shared-link.entity';
import { SmartInfoEntity } from './smart-info.entity';
import { SystemConfigEntity } from './system-config.entity';
import { UserTokenEntity } from './user-token.entity';
import { UserEntity } from './user.entity';

export * from './album.entity';
export * from './api-key.entity';
export * from './asset.entity';
export * from './exif.entity';
export * from './shared-link.entity';
export * from './smart-info.entity';
export * from './system-config.entity';
export * from './tag.entity';
export * from './user-token.entity';
export * from './user.entity';
export * from './person.entity';
export * from './asset-face.entity';

export const databaseEntities = [
  AssetEntity,
  AlbumEntity,
  APIKeyEntity,
  UserEntity,
  SharedLinkEntity,
  SmartInfoEntity,
  SystemConfigEntity,
  UserTokenEntity,
  PersonEntity,
  AssetFaceEntity,
];
