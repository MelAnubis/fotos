import { IsEnum, IsString, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { TranscodePreset } from '@app/infra/entities';
import { Type } from 'class-transformer';

export class SystemConfigFFmpegDto {
  @IsInt()
  @Min(0)
  @Max(51)
  @Type(() => Number)
  crf!: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  threads!: number;

  @IsString()
  preset!: string;

  @IsString()
  targetVideoCodec!: string;

  @IsString()
  targetAudioCodec!: string;

  @IsString()
  targetResolution!: string;

  @IsString()
  maxBitrate!: string;

  @IsBoolean()
  twoPass!: boolean;

  @IsEnum(TranscodePreset)
  transcode!: TranscodePreset;
}
