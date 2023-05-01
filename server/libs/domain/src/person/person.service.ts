import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AssetResponseDto, mapAsset } from '../asset';
import { AuthUserDto } from '../auth';
import { ImmichReadStream, IStorageRepository } from '../storage';
import { PersonUpdateDto } from './dto';
import { IPersonRepository } from './person.repository';
import { mapPerson, PersonResponseDto } from './response-dto';

@Injectable()
export class PersonService {
  constructor(
    @Inject(IPersonRepository) private repository: IPersonRepository,
    @Inject(IStorageRepository) private storageRepository: IStorageRepository,
  ) {}

  async getAll(authUser: AuthUserDto): Promise<PersonResponseDto[]> {
    const people = await this.repository.getAll(authUser.id);
    return people.map((person) => mapPerson(person));
  }

  async getById(authUser: AuthUserDto, personId: string): Promise<PersonResponseDto> {
    const person = await this.repository.getById(authUser.id, personId);
    if (!person) {
      throw new NotFoundException();
    }

    return mapPerson(person);
  }

  async getThumbnail(authUser: AuthUserDto, personId: string): Promise<ImmichReadStream> {
    const person = await this.repository.getById(authUser.id, personId);
    if (!person || !person.thumbnailPath) {
      throw new NotFoundException();
    }

    return this.storageRepository.createReadStream(person.thumbnailPath, 'image/jpeg');
  }

  async getAssets(authUser: AuthUserDto, personId: string): Promise<AssetResponseDto[]> {
    const assets = await this.repository.getAssets(authUser.id, personId);
    return assets.map(mapAsset);
  }

  async update(authUser: AuthUserDto, personId: string, dto: PersonUpdateDto): Promise<PersonResponseDto> {
    const person = await this.repository.getById(authUser.id, personId);
    if (!person) {
      throw new BadRequestException();
    }

    const updatedPerson = await this.repository.update({ ...person, name: dto.name });
    return mapPerson(updatedPerson);
  }
}
