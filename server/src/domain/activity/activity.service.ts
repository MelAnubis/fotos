import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { AccessCore, Permission } from '../access';
import { AuthUserDto } from '../auth';
import { IAccessRepository, IActivityRepository, IAlbumRepository } from '../repositories';

import {
  ActivityCommentDto,
  ActivityDto,
  ActivityFavoriteDto,
  ActivityReponseDto,
  LikeStatusReponseDto,
  StatisticsResponseDto,
  mapActivities,
  mapActivity,
  mapStatistics,
} from './activity.dto';

@Injectable()
export class ActivityService {
  private access: AccessCore;
  readonly logger = new Logger(ActivityService.name);

  constructor(
    @Inject(IAccessRepository) accessRepository: IAccessRepository,
    @Inject(IActivityRepository) private repository: IActivityRepository,
    @Inject(IAlbumRepository) private albumRepository: IAlbumRepository,
  ) {
    this.access = AccessCore.create(accessRepository);
  }

  async getById(authUser: AuthUserDto, dto: ActivityDto): Promise<ActivityReponseDto[]> {
    await this.access.requirePermission(authUser, Permission.ASSET_READ, dto.assetId);
    const album = await this.albumRepository.getById(dto.albumId, { withAssets: false });
    if (!album?.sharedUsers.length) {
      throw new BadRequestException('Album is not shared');
    }
    return this.findOrFail(dto.assetId, dto.albumId).then(mapActivities);
  }

  async getStatistics(authUser: AuthUserDto, dto: ActivityDto): Promise<StatisticsResponseDto> {
    await this.access.requirePermission(authUser, Permission.ASSET_READ, dto.assetId);
    const album = await this.albumRepository.getById(dto.albumId, { withAssets: false });
    if (!album?.sharedUsers.length) {
      throw new BadRequestException('Album is not shared');
    }
    return mapStatistics(await this.repository.getStatistics(dto.assetId, dto.albumId));
  }

  async getFavorite(authUser: AuthUserDto, dto: ActivityDto): Promise<LikeStatusReponseDto> {
    await this.access.requirePermission(authUser, Permission.ASSET_READ, dto.assetId);
    const album = await this.albumRepository.getById(dto.albumId, { withAssets: false });
    if (!album?.sharedUsers.length) {
      throw new BadRequestException('Album is not shared');
    }
    const favorite = await this.repository.getFavorite(dto.assetId, dto.albumId, authUser.id);
    if (favorite) {
      return { value: true };
    } else {
      return { value: false };
    }
  }

  async addComment(authUser: AuthUserDto, dto: ActivityCommentDto): Promise<ActivityReponseDto> {
    await this.access.requirePermission(authUser, Permission.ASSET_READ, dto.assetId);
    const album = await this.albumRepository.getById(dto.albumId, { withAssets: false });
    if (!album?.sharedUsers.length) {
      throw new BadRequestException('Album is not shared');
    }
    const comment = dto.comment;
    const activity = await this.repository.update({
      assetId: dto.assetId,
      userId: authUser.id,
      albumId: dto.albumId,
      comment,
    });
    return this.findSingleOrFail(activity.id).then(mapActivity);
  }

  async deleteComment(authUser: AuthUserDto, id: string): Promise<void> {
    const comment = await this.findSingleOrFail(id);
    if (
      !(await this.access.hasPermission(authUser, Permission.ALBUM_DELETE, comment.albumId)) &&
      !(await authUser.isAdmin) &&
      !(comment.userId === authUser.id)
    ) {
      throw new BadRequestException(`User ${authUser.id} has not the permission to delete comment ${comment.albumId}`);
    }

    this.repository.delete(comment);
  }

  async changeFavorite(authUser: AuthUserDto, dto: ActivityFavoriteDto): Promise<ActivityReponseDto | void> {
    await this.access.requirePermission(authUser, Permission.ASSET_READ, dto.assetId);
    const album = await this.albumRepository.getById(dto.albumId, { withAssets: false });
    if (!album?.sharedUsers.length) {
      throw new BadRequestException('Album is not shared');
    }
    const favorite = dto.favorite;
    const reaction = await this.repository.getFavorite(dto.assetId, dto.albumId, authUser.id);
    const isFavorite = reaction ? reaction.isLiked : false;

    if (favorite === isFavorite) {
      if (reaction) {
        return mapActivity(reaction);
      } else {
        return;
      }
    } else if (reaction) {
      this.repository.delete(reaction);
      return;
    } else {
      const test = await this.repository.update({
        assetId: dto.assetId,
        userId: authUser.id,
        albumId: dto.albumId,
        isLiked: true,
      });

      return mapActivity(test);
    }
  }

  private async findSingleOrFail(id: string) {
    const activity = await this.repository.getReactionById(id);
    if (!activity) {
      throw new BadRequestException('Activity not found');
    }
    return activity;
  }

  private async findOrFail(assetId: string, albumId: string) {
    const activity = await this.repository.getById(assetId, albumId);
    if (!activity) {
      throw new BadRequestException('Activity not found');
    }
    return activity;
  }
}
