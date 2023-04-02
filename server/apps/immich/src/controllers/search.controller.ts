import {
  AuthUserDto,
  SearchConfigResponseDto,
  SearchDto,
  SearchExploreResponseDto,
  SearchResponseDto,
  SearchService,
} from '@app/domain';
import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAuthUser } from '../decorators/auth-user.decorator';
import { Authenticated } from '../decorators/authenticated.decorator';

@ApiTags('Search')
@Controller('search')
@Authenticated()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class SearchController {
  constructor(private service: SearchService) {}

  @Get()
  search(@GetAuthUser() authUser: AuthUserDto, @Query() dto: SearchDto): Promise<SearchResponseDto> {
    return this.service.search(authUser, dto);
  }

  @Get('config')
  getSearchConfig(): SearchConfigResponseDto {
    return this.service.getConfig();
  }

  @Get('explore')
  getExploreData(@GetAuthUser() authUser: AuthUserDto): Promise<SearchExploreResponseDto[]> {
    return this.service.getExploreData(authUser) as Promise<SearchExploreResponseDto[]>;
  }
}
