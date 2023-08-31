import { IsOptional } from '../../domain.util';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UserCountDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  /**
   * When true, return the number of admins accounts
   */
  admin?: boolean = false;
}
