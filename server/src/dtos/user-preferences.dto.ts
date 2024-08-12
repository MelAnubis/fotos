import { ApiDefaultResponse, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { UserAvatarColor, UserPreferences } from 'src/entities/user-metadata.entity';
import { Optional, ValidateBoolean } from 'src/validation';

class AvatarUpdate {
  @Optional()
  @IsEnum(UserAvatarColor)
  @ApiProperty({ enumName: 'UserAvatarColor', enum: UserAvatarColor })
  color?: UserAvatarColor;
}

class MemoryUpdate {
  @ValidateBoolean({ optional: true })
  enabled?: boolean;
}

class RatingUpdate {
  @ValidateBoolean({ optional: true })
  enabled?: boolean;
}

class EmailNotificationsUpdate {
  @ValidateBoolean({ optional: true })
  enabled?: boolean;

  @ValidateBoolean({ optional: true })
  albumInvite?: boolean;

  @ValidateBoolean({ optional: true })
  albumUpdate?: boolean;
}

class DownloadUpdate {
  @Optional()
  @IsInt()
  @IsPositive()
  @ApiProperty({ type: 'integer' })
  archiveSize?: number;
}

class PurchaseUpdate {
  @ValidateBoolean({ optional: true })
  showSupportBadge?: boolean;

  @IsDateString()
  @Optional()
  hideBuyButtonUntil?: string;
}

export class UserPreferencesUpdateDto {
  @Optional()
  @ValidateNested()
  @Type(() => RatingUpdate)
  rating?: RatingUpdate;

  @Optional()
  @ValidateNested()
  @Type(() => AvatarUpdate)
  avatar?: AvatarUpdate;

  @Optional()
  @ValidateNested()
  @Type(() => MemoryUpdate)
  memories?: MemoryUpdate;

  @Optional()
  @ValidateNested()
  @Type(() => EmailNotificationsUpdate)
  emailNotifications?: EmailNotificationsUpdate;

  @Optional()
  @ValidateNested()
  @Type(() => DownloadUpdate)
  download?: DownloadUpdate;

  @Optional()
  @ValidateNested()
  @Type(() => PurchaseUpdate)
  purchase?: PurchaseUpdate;
}

class AvatarResponse {
  @ApiProperty({ enumName: 'UserAvatarColor', enum: UserAvatarColor })
  color!: UserAvatarColor;
}

class RatingResponse {
  enabled!: boolean;
}

class MemoryResponse {
  enabled!: boolean;
}

class EmailNotificationsResponse {
  enabled!: boolean;
  albumInvite!: boolean;
  albumUpdate!: boolean;
}

class DownloadResponse {
  @ApiProperty({ type: 'integer' })
  archiveSize!: number;
}

class PurchaseResponse {
  showSupportBadge!: boolean;
  hideBuyButtonUntil!: string;
}

export class UserPreferencesResponseDto implements UserPreferences {
  @ApiProperty({ nullable: true })
  rating!: RatingResponse;
  memories!: MemoryResponse;
  @ApiProperty({ nullable: true })
  avatar!: AvatarResponse;
  emailNotifications!: EmailNotificationsResponse;
  download!: DownloadResponse;
  purchase!: PurchaseResponse;
}

export const mapPreferences = (preferences: UserPreferences): UserPreferencesResponseDto => {
  return preferences;
};
