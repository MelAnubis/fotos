import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Get,
  Param,
  ValidationPipe,
  Query,
  Response,
  Headers,
  Delete,
  Logger,
  HttpCode,
  BadRequestException,
  UploadedFile,
  Header,
  Put,
  UploadedFiles,
} from '@nestjs/common';
import { Authenticated } from '../../decorators/authenticated.decorator';
import { AssetService } from './asset.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { assetUploadOption } from '../../config/asset-upload.config';
import { AuthUserDto, GetAuthUser } from '../../decorators/auth-user.decorator';
import { ServeFileDto } from './dto/serve-file.dto';
import { Response as Res } from 'express';
import { BackgroundTaskService } from '../../modules/background-task/background-task.service';
import { DeleteAssetDto } from './dto/delete-asset.dto';
import { SearchAssetDto } from './dto/search-asset.dto';
import { CommunicationGateway } from '../communication/communication.gateway';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IAssetUploadedJob } from '@app/job/index';
import { QueueNameEnum } from '@app/job/constants/queue-name.constant';
import { assetUploadedProcessorName } from '@app/job/constants/job-name.constant';
import { CheckDuplicateAssetDto } from './dto/check-duplicate-asset.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CuratedObjectsResponseDto } from './response-dto/curated-objects-response.dto';
import { CuratedLocationsResponseDto } from './response-dto/curated-locations-response.dto';
import { AssetResponseDto } from './response-dto/asset-response.dto';
import { CheckDuplicateAssetResponseDto } from './response-dto/check-duplicate-asset-response.dto';
import { AssetFileUploadDto } from './dto/asset-file-upload.dto';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetFileUploadResponseDto } from './response-dto/asset-file-upload-response.dto';
import { DeleteAssetResponseDto, DeleteAssetStatusEnum } from './response-dto/delete-asset-response.dto';
import { GetAssetThumbnailDto } from './dto/get-asset-thumbnail.dto';
import { AssetCountByTimeBucketResponseDto } from './response-dto/asset-count-by-time-group-response.dto';
import { GetAssetCountByTimeBucketDto } from './dto/get-asset-count-by-time-bucket.dto';
import { GetAssetByTimeBucketDto } from './dto/get-asset-by-time-bucket.dto';
import { AssetCountByUserIdResponseDto } from './response-dto/asset-count-by-user-id-response.dto';
import { CheckExistingAssetsDto } from './dto/check-existing-assets.dto';
import { CheckExistingAssetsResponseDto } from './response-dto/check-existing-assets-response.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Authenticated()
@ApiBearerAuth()
@ApiTags('Asset')
@Controller('asset')
export class AssetController {
  constructor(private assetService: AssetService, private backgroundTaskService: BackgroundTaskService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'assetData', maxCount: 1 },
        { name: 'livePhotoData', maxCount: 1 },
      ],
      assetUploadOption,
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Asset Upload Information',
    type: AssetFileUploadDto,
  })
  async uploadFile(
    @GetAuthUser() authUser: AuthUserDto,
    @UploadedFiles() files: { assetData: Express.Multer.File[]; livePhotoData?: Express.Multer.File[] },
    @Body(ValidationPipe) createAssetDto: CreateAssetDto,
    @Response({ passthrough: true }) res: Res,
  ): Promise<AssetFileUploadResponseDto> {
    const originalAssetData = files.assetData[0];
    const livePhotoAssetData = files.livePhotoData?.[0];

    return this.assetService.handleUploadedAsset(authUser, createAssetDto, res, originalAssetData, livePhotoAssetData);
  }

  @Get('/download')
  async downloadFile(
    @GetAuthUser() authUser: AuthUserDto,
    @Response({ passthrough: true }) res: Res,
    @Query(new ValidationPipe({ transform: true })) query: ServeFileDto,
  ): Promise<any> {
    return this.assetService.downloadFile(query, res);
  }

  @Get('/file')
  async serveFile(
    @Headers() headers: Record<string, string>,
    @GetAuthUser() authUser: AuthUserDto,
    @Response({ passthrough: true }) res: Res,
    @Query(new ValidationPipe({ transform: true })) query: ServeFileDto,
  ): Promise<any> {
    return this.assetService.serveFile(authUser, query, res, headers);
  }

  @Get('/thumbnail/:assetId')
  @Header('Cache-Control', 'max-age=300')
  async getAssetThumbnail(
    @Response({ passthrough: true }) res: Res,
    @Param('assetId') assetId: string,
    @Query(new ValidationPipe({ transform: true })) query: GetAssetThumbnailDto,
  ): Promise<any> {
    return this.assetService.getAssetThumbnail(assetId, query, res);
  }

  @Get('/curated-objects')
  async getCuratedObjects(@GetAuthUser() authUser: AuthUserDto): Promise<CuratedObjectsResponseDto[]> {
    return this.assetService.getCuratedObject(authUser);
  }

  @Get('/curated-locations')
  async getCuratedLocations(@GetAuthUser() authUser: AuthUserDto): Promise<CuratedLocationsResponseDto[]> {
    return this.assetService.getCuratedLocation(authUser);
  }

  @Get('/search-terms')
  async getAssetSearchTerms(@GetAuthUser() authUser: AuthUserDto): Promise<string[]> {
    return this.assetService.getAssetSearchTerm(authUser);
  }

  @Post('/search')
  async searchAsset(
    @GetAuthUser() authUser: AuthUserDto,
    @Body(ValidationPipe) searchAssetDto: SearchAssetDto,
  ): Promise<AssetResponseDto[]> {
    return this.assetService.searchAsset(authUser, searchAssetDto);
  }

  @Post('/count-by-time-bucket')
  async getAssetCountByTimeBucket(
    @GetAuthUser() authUser: AuthUserDto,
    @Body(ValidationPipe) getAssetCountByTimeGroupDto: GetAssetCountByTimeBucketDto,
  ): Promise<AssetCountByTimeBucketResponseDto> {
    return this.assetService.getAssetCountByTimeBucket(authUser, getAssetCountByTimeGroupDto);
  }

  @Get('/count-by-user-id')
  async getAssetCountByUserId(@GetAuthUser() authUser: AuthUserDto): Promise<AssetCountByUserIdResponseDto> {
    return this.assetService.getAssetCountByUserId(authUser);
  }

  /**
   * Get all AssetEntity belong to the user
   */
  @Get('/')
  async getAllAssets(@GetAuthUser() authUser: AuthUserDto): Promise<AssetResponseDto[]> {
    return await this.assetService.getAllAssets(authUser);
  }

  @Post('/time-bucket')
  async getAssetByTimeBucket(
    @GetAuthUser() authUser: AuthUserDto,
    @Body(ValidationPipe) getAssetByTimeBucketDto: GetAssetByTimeBucketDto,
  ): Promise<AssetResponseDto[]> {
    return await this.assetService.getAssetByTimeBucket(authUser, getAssetByTimeBucketDto);
  }
  /**
   * Get all asset of a device that are in the database, ID only.
   */
  @Get('/:deviceId')
  async getUserAssetsByDeviceId(@GetAuthUser() authUser: AuthUserDto, @Param('deviceId') deviceId: string) {
    return await this.assetService.getUserAssetsByDeviceId(authUser, deviceId);
  }

  /**
   * Get a single asset's information
   */
  @Get('/assetById/:assetId')
  async getAssetById(
    @GetAuthUser() authUser: AuthUserDto,
    @Param('assetId') assetId: string,
  ): Promise<AssetResponseDto> {
    return await this.assetService.getAssetById(authUser, assetId);
  }

  /**
   * Update an asset
   */
  @Put('/assetById/:assetId')
  async updateAssetById(
    @GetAuthUser() authUser: AuthUserDto,
    @Param('assetId') assetId: string,
    @Body() dto: UpdateAssetDto,
  ): Promise<AssetResponseDto> {
    return await this.assetService.updateAssetById(authUser, assetId, dto);
  }

  @Delete('/')
  async deleteAsset(
    @GetAuthUser() authUser: AuthUserDto,
    @Body(ValidationPipe) assetIds: DeleteAssetDto,
  ): Promise<DeleteAssetResponseDto[]> {
    const deleteAssetList: AssetResponseDto[] = [];

    for (const id of assetIds.ids) {
      const assets = await this.assetService.getAssetById(authUser, id);
      if (!assets) {
        continue;
      }
      deleteAssetList.push(assets);
    }

    const result = await this.assetService.deleteAssetById(authUser, assetIds);

    result.forEach((res) => {
      deleteAssetList.filter((a) => a.id == res.id && res.status == DeleteAssetStatusEnum.SUCCESS);
    });

    await this.backgroundTaskService.deleteFileOnDisk(deleteAssetList);

    return result;
  }

  /**
   * Check duplicated asset before uploading - for Web upload used
   */
  @Post('/check')
  @HttpCode(200)
  async checkDuplicateAsset(
    @GetAuthUser() authUser: AuthUserDto,
    @Body(ValidationPipe) checkDuplicateAssetDto: CheckDuplicateAssetDto,
  ): Promise<CheckDuplicateAssetResponseDto> {
    return await this.assetService.checkDuplicatedAsset(authUser, checkDuplicateAssetDto);
  }

  /**
   * Checks if multiple assets exist on the server and returns all existing - used by background backup
   */
  @Post('/exist')
  @HttpCode(200)
  async checkExistingAssets(
    @GetAuthUser() authUser: AuthUserDto,
    @Body(ValidationPipe) checkExistingAssetsDto: CheckExistingAssetsDto,
  ): Promise<CheckExistingAssetsResponseDto> {
    return await this.assetService.checkExistingAssets(authUser, checkExistingAssetsDto);
  }
}
