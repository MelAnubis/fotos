import { AssetEntity } from '@app/infra/entities';
import { ImmichLogger } from '@app/infra/logger';
import { Inject, Injectable } from '@nestjs/common';
import { IsNull, Not } from 'typeorm';
import { AssetResponseDto, mapAsset } from '../asset';
import { AuthDto } from '../auth';
import { PersonResponseDto, mapPerson } from '../person';
import {
  IAssetRepository,
  IMachineLearningRepository,
  IMetadataRepository,
  IPartnerRepository,
  IPersonRepository,
  ISmartInfoRepository,
  ISystemConfigRepository,
  SearchExploreItem,
  SearchStrategy,
} from '../repositories';
import { FeatureFlag, SystemConfigCore } from '../system-config';
import { SearchDto, SearchPeopleDto } from './dto';
import {
  SearchSuggestionRequestDto,
  SearchSuggestionResponseDto,
  SearchSuggestionType,
} from './dto/search-suggestion.dto';
import { SearchResponseDto } from './response-dto';

@Injectable()
export class SearchService {
  private logger = new ImmichLogger(SearchService.name);
  private configCore: SystemConfigCore;

  constructor(
    @Inject(ISystemConfigRepository) configRepository: ISystemConfigRepository,
    @Inject(IMachineLearningRepository) private machineLearning: IMachineLearningRepository,
    @Inject(IPersonRepository) private personRepository: IPersonRepository,
    @Inject(ISmartInfoRepository) private smartInfoRepository: ISmartInfoRepository,
    @Inject(IAssetRepository) private assetRepository: IAssetRepository,
    @Inject(IPartnerRepository) private partnerRepository: IPartnerRepository,
    @Inject(IMetadataRepository) private metadataRepository: IMetadataRepository,
  ) {
    this.configCore = SystemConfigCore.create(configRepository);
  }

  async searchPerson(auth: AuthDto, dto: SearchPeopleDto): Promise<PersonResponseDto[]> {
    return this.personRepository.getByName(auth.user.id, dto.name, { withHidden: dto.withHidden });
  }

  async getExploreData(auth: AuthDto): Promise<SearchExploreItem<AssetResponseDto>[]> {
    await this.configCore.requireFeature(FeatureFlag.SEARCH);
    const options = { maxFields: 12, minAssetsPerField: 5 };
    const results = await Promise.all([
      this.assetRepository.getAssetIdByCity(auth.user.id, options),
      this.assetRepository.getAssetIdByTag(auth.user.id, options),
    ]);
    const assetIds = new Set<string>(results.flatMap((field) => field.items.map((item) => item.data)));
    const assets = await this.assetRepository.getByIds([...assetIds]);
    const assetMap = new Map<string, AssetResponseDto>(assets.map((asset) => [asset.id, mapAsset(asset)]));

    return results.map(({ fieldName, items }) => ({
      fieldName,
      items: items.map(({ value, data }) => ({ value, data: assetMap.get(data) as AssetResponseDto })),
    }));
  }

  async search(auth: AuthDto, dto: SearchDto): Promise<SearchResponseDto> {
    await this.configCore.requireFeature(FeatureFlag.SEARCH);
    const { machineLearning } = await this.configCore.getConfig();
    const query = dto.q || dto.query;
    if (!query) {
      throw new Error('Missing query');
    }

    let strategy = SearchStrategy.TEXT;
    if (dto.smart || dto.clip) {
      await this.configCore.requireFeature(FeatureFlag.SMART_SEARCH);
      strategy = SearchStrategy.SMART;
    }

    const userIds = await this.getUserIdsToSearch(auth);
    const withArchived = dto.withArchived || false;

    let assets: AssetEntity[] = [];

    switch (strategy) {
      case SearchStrategy.SMART: {
        const embedding = await this.machineLearning.encodeText(
          machineLearning.url,
          { text: query },
          machineLearning.clip,
        );
        assets = await this.smartInfoRepository.searchCLIP({
          userIds: userIds,
          embedding,
          numResults: 100,
          withArchived,
        });
        break;
      }
      case SearchStrategy.TEXT: {
        assets = await this.assetRepository.searchMetadata(query, userIds, { numResults: 250 });
      }
      default: {
        break;
      }
    }

    return {
      albums: {
        total: 0,
        count: 0,
        items: [],
        facets: [],
      },
      assets: {
        total: assets.length,
        count: assets.length,
        items: assets.map((asset) => mapAsset(asset)),
        facets: [],
      },
    };
  }

  private async getUserIdsToSearch(auth: AuthDto): Promise<string[]> {
    const userIds: string[] = [auth.user.id];
    const partners = await this.partnerRepository.getAll(auth.user.id);
    const partnersIds = partners
      .filter((partner) => partner.sharedBy && partner.inTimeline)
      .map((partner) => partner.sharedById);
    userIds.push(...partnersIds);
    return userIds;
  }

  async getSearchSuggestions(auth: AuthDto, dto: SearchSuggestionRequestDto): Promise<SearchSuggestionResponseDto> {
    let response: SearchSuggestionResponseDto = { people: [], data: [] };

    if (dto.type === SearchSuggestionType.People) {
      const people = await this.personRepository.getAllWithName(auth.user.id);
      response = {
        people: people.map((person) => mapPerson(person)),
      };
    }

    if (dto.type === SearchSuggestionType.Country) {
      const country = await this.metadataRepository.getCountries(auth.user.id);
      response = {
        data: country,
      };
    }

    if (dto.type === SearchSuggestionType.State) {
      const states = await this.metadataRepository.getStates(auth.user.id, dto.country);
      response = {
        data: states,
      };
    }

    if (dto.type === SearchSuggestionType.City) {
      const cities = await this.metadataRepository.getCities(auth.user.id, dto.country, dto.state);
      response = {
        data: cities,
      };
    }

    if (dto.type === SearchSuggestionType.CameraMake) {
      const makes = await this.metadataRepository.getCameraMakes(auth.user.id, dto.model);
      response = {
        data: makes,
      };
    }

    if (dto.type === SearchSuggestionType.CameraModel) {
      const model = await this.metadataRepository.getCameraModels(auth.user.id, dto.make);
      response = {
        data: model,
      };
    }

    return response;
  }
}
