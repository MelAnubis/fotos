import { BadRequestException, Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AuthUserDto } from '../../decorators/auth-user.decorator';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumEntity, SharedLinkType } from '@app/database';
import { AddUsersDto } from './dto/add-users.dto';
import { RemoveAssetsDto } from './dto/remove-assets.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { GetAlbumsDto } from './dto/get-albums.dto';
import { AlbumResponseDto, mapAlbum, mapAlbumExcludeAssetInfo } from './response-dto/album-response.dto';
import { IAlbumRepository } from './album-repository';
import { AlbumCountResponseDto } from './response-dto/album-count-response.dto';
import { AddAssetsResponseDto } from './response-dto/add-assets-response.dto';
import { AddAssetsDto } from './dto/add-assets.dto';
import { DownloadService } from '../../modules/download/download.service';
import { DownloadDto } from '../asset/dto/download-library.dto';
import { ShareCore } from '../share/share.core';
import { ISharedLinkRepository } from '../share/shared-link.repository';
import { mapSharedLinkToResponseDto, SharedLinkResponseDto } from '../share/response-dto/shared-link-response.dto';
import { CreateAlbumShareLinkDto } from './dto/create-album-shared-link.dto';
import _ from 'lodash';

@Injectable()
export class AlbumService {
  private shareCore: ShareCore;

  constructor(
    @Inject(IAlbumRepository) private _albumRepository: IAlbumRepository,
    @Inject(ISharedLinkRepository) private sharedLinkRepository: ISharedLinkRepository,
    private downloadService: DownloadService,
  ) {
    this.shareCore = new ShareCore(sharedLinkRepository);
  }

  private async _getAlbum({
    authUser,
    albumId,
    validateIsOwner = true,
  }: {
    authUser: AuthUserDto;
    albumId: string;
    validateIsOwner?: boolean;
  }): Promise<AlbumEntity> {
    const album = await this._albumRepository.get(albumId);
    if (!album) {
      throw new NotFoundException('Album Not Found');
    }
    const isOwner = album.ownerId == authUser.id;

    if (validateIsOwner && !isOwner) {
      throw new ForbiddenException('Unauthorized Album Access');
    } else if (!isOwner && !album.sharedUsers?.some((user) => user.sharedUserId == authUser.id)) {
      throw new ForbiddenException('Unauthorized Album Access');
    }
    return album;
  }

  async create(authUser: AuthUserDto, createAlbumDto: CreateAlbumDto): Promise<AlbumResponseDto> {
    const albumEntity = await this._albumRepository.create(authUser.id, createAlbumDto);
    return mapAlbum(albumEntity);
  }

  /**
   * Get all shared album, including owned and shared one.
   * @param authUser AuthUserDto
   * @returns All Shared Album And Its Members
   */
  async getAllAlbums(authUser: AuthUserDto, getAlbumsDto: GetAlbumsDto): Promise<AlbumResponseDto[]> {
    let albums: AlbumEntity[];

    if (typeof getAlbumsDto.assetId === 'string') {
      albums = await this._albumRepository.getListByAssetId(authUser.id, getAlbumsDto.assetId);
    } else {
      albums = await this._albumRepository.getList(authUser.id, getAlbumsDto);
      if (getAlbumsDto.shared) {
        const publicSharingAlbums = await this._albumRepository.getPublicSharingList(authUser.id);
        albums = [...albums, ...publicSharingAlbums];
      }
    }

    albums = _.uniqBy(albums, (album) => album.id);

    for (const album of albums) {
      await this._checkValidThumbnail(album);
    }

    return albums.map((album) => mapAlbumExcludeAssetInfo(album));
  }

  async getAlbumInfo(authUser: AuthUserDto, albumId: string): Promise<AlbumResponseDto> {
    const album = await this._getAlbum({ authUser, albumId, validateIsOwner: false });
    return mapAlbum(album);
  }

  async addUsersToAlbum(authUser: AuthUserDto, addUsersDto: AddUsersDto, albumId: string): Promise<AlbumResponseDto> {
    const album = await this._getAlbum({ authUser, albumId });
    const updatedAlbum = await this._albumRepository.addSharedUsers(album, addUsersDto);
    return mapAlbum(updatedAlbum);
  }

  async deleteAlbum(authUser: AuthUserDto, albumId: string): Promise<void> {
    const album = await this._getAlbum({ authUser, albumId });

    for (const sharedLink of album.sharedLinks) {
      await this.shareCore.removeSharedLink(sharedLink.id.toString('hex'));
    }

    await this._albumRepository.delete(album);
  }

  async removeUserFromAlbum(authUser: AuthUserDto, albumId: string, userId: string | 'me'): Promise<void> {
    const sharedUserId = userId == 'me' ? authUser.id : userId;
    const album = await this._getAlbum({ authUser, albumId, validateIsOwner: false });
    if (album.ownerId != authUser.id && authUser.id != sharedUserId) {
      throw new ForbiddenException('Cannot remove a user from a album that is not owned');
    }
    if (album.ownerId == sharedUserId) {
      throw new BadRequestException('The owner of the album cannot be removed');
    }
    await this._albumRepository.removeUser(album, sharedUserId);
  }

  async removeAssetsFromAlbum(
    authUser: AuthUserDto,
    removeAssetsDto: RemoveAssetsDto,
    albumId: string,
  ): Promise<AlbumResponseDto> {
    const album = await this._getAlbum({ authUser, albumId });
    const deletedCount = await this._albumRepository.removeAssets(album, removeAssetsDto);
    const newAlbum = await this._getAlbum({ authUser, albumId });

    if (newAlbum) {
      await this._checkValidThumbnail(newAlbum);
    }

    if (deletedCount !== removeAssetsDto.assetIds.length) {
      throw new BadRequestException('Some assets were not found in the album');
    }

    await this.updateAssetInSharedLinks(newAlbum);

    return mapAlbum(newAlbum);
  }

  async addAssetsToAlbum(
    authUser: AuthUserDto,
    addAssetsDto: AddAssetsDto,
    albumId: string,
  ): Promise<AddAssetsResponseDto> {
    const album = await this._getAlbum({ authUser, albumId, validateIsOwner: false });
    const result = await this._albumRepository.addAssets(album, addAssetsDto);
    const newAlbum = await this._getAlbum({ authUser, albumId, validateIsOwner: false });
    await this.updateAssetInSharedLinks(newAlbum);

    return {
      ...result,
      album: mapAlbum(newAlbum),
    };
  }

  async updateAlbumInfo(
    authUser: AuthUserDto,
    updateAlbumDto: UpdateAlbumDto,
    albumId: string,
  ): Promise<AlbumResponseDto> {
    const album = await this._getAlbum({ authUser, albumId });

    if (authUser.id != album.ownerId) {
      throw new BadRequestException('Unauthorized to change album info');
    }

    const updatedAlbum = await this._albumRepository.updateAlbum(album, updateAlbumDto);
    return mapAlbum(updatedAlbum);
  }

  async getAlbumCountByUserId(authUser: AuthUserDto): Promise<AlbumCountResponseDto> {
    return this._albumRepository.getCountByUserId(authUser.id);
  }

  async downloadArchive(authUser: AuthUserDto, albumId: string, dto: DownloadDto) {
    const album = await this._getAlbum({ authUser, albumId, validateIsOwner: false });
    const assets = (album.assets || []).map((asset) => asset.assetInfo).slice(dto.skip || 0);

    return this.downloadService.downloadArchive(album.albumName, assets);
  }

  async _checkValidThumbnail(album: AlbumEntity) {
    const assets = album.assets || [];
    const valid = assets.some((asset) => asset.assetId === album.albumThumbnailAssetId);
    if (!valid) {
      let dto: UpdateAlbumDto = {};
      if (assets.length > 0) {
        const albumThumbnailAssetId = assets[0].assetId;
        dto = { albumThumbnailAssetId };
      }
      await this._albumRepository.updateAlbum(album, dto);
      album.albumThumbnailAssetId = dto.albumThumbnailAssetId || null;
    }
  }

  async createAlbumSharedLink(authUser: AuthUserDto, dto: CreateAlbumShareLinkDto): Promise<SharedLinkResponseDto> {
    const album = await this._getAlbum({ authUser, albumId: dto.albumId });

    const sharedLink = await this.shareCore.createSharedLink(authUser.id, {
      sharedType: SharedLinkType.ALBUM,
      expiredAt: dto.expiredAt,
      allowUpload: dto.allowUpload,
      album: album,
      assets: album.assets?.map((asset) => asset.assetInfo) || [],
      description: dto.description,
    });

    return mapSharedLinkToResponseDto(sharedLink);
  }

  async updateAssetInSharedLinks(album: AlbumEntity) {
    // Update asset in shared links
    if (album.sharedLinks.length > 0) {
      const sharedLinkIds = album.sharedLinks.map((link) => link.id);
      if (album.assets && album.assets.length > 0) {
        const assets = album.assets.map((asset) => asset.assetInfo);

        for (const sharedLinkId of sharedLinkIds) {
          await this.shareCore.updataAssetsInSharedLink(sharedLinkId.toString('hex'), assets);
        }
      }
    }
  }

  async checkPublicUploadAccess(sharedKey: string) {
    const sharedLink = await this.shareCore.getSharedLinkByKey(sharedKey);
    if (!sharedLink.allowUpload) {
      throw new ForbiddenException();
    }
  }
}
