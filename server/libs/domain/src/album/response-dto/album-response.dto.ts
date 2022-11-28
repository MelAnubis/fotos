import { AlbumEntity } from '@app/infra/db/entities';
import { ApiProperty } from '@nestjs/swagger';
import { AssetResponseDto, mapAsset } from '../../asset';
import { mapUser, UserResponseDto } from '../../user';

export class AlbumResponseDto {
  id!: string;
  ownerId!: string;
  albumName!: string;
  createdAt!: string;
  modifiedAt!: string;
  albumThumbnailAssetId!: string | null;
  shared!: boolean;
  sharedUsers!: UserResponseDto[];
  assets!: AssetResponseDto[];

  @ApiProperty({ type: 'integer' })
  assetCount!: number;
}

export function mapAlbum(entity: AlbumEntity): AlbumResponseDto {
  const sharedUsers: UserResponseDto[] = [];

  entity.sharedUsers?.forEach((userAlbum) => {
    if (userAlbum.userInfo) {
      const user = mapUser(userAlbum.userInfo);
      sharedUsers.push(user);
    }
  });
  return {
    albumName: entity.albumName,
    albumThumbnailAssetId: entity.albumThumbnailAssetId,
    createdAt: entity.createdAt,
    modifiedAt: entity.modifiedAt,
    id: entity.id,
    ownerId: entity.ownerId,
    sharedUsers,
    shared: sharedUsers.length > 0 || entity.sharedLinks?.length > 0,
    assets: entity.assets?.map((assetAlbum) => mapAsset(assetAlbum.assetInfo)) || [],
    assetCount: entity.assets?.length || 0,
  };
}

export function mapAlbumExcludeAssetInfo(entity: AlbumEntity): AlbumResponseDto {
  const sharedUsers: UserResponseDto[] = [];

  entity.sharedUsers?.forEach((userAlbum) => {
    if (userAlbum.userInfo) {
      const user = mapUser(userAlbum.userInfo);
      sharedUsers.push(user);
    }
  });
  return {
    albumName: entity.albumName,
    albumThumbnailAssetId: entity.albumThumbnailAssetId,
    createdAt: entity.createdAt,
    modifiedAt: entity.modifiedAt,
    id: entity.id,
    ownerId: entity.ownerId,
    sharedUsers,
    shared: sharedUsers.length > 0 || entity.sharedLinks?.length > 0,
    assets: [],
    assetCount: entity.assets?.length || 0,
  };
}
