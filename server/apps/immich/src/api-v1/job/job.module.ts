import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { ImmichJwtService } from '../../modules/immich-jwt/immich-jwt.service';
import { ImmichJwtModule } from '../../modules/immich-jwt/immich-jwt.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { QueueNameEnum } from '@app/job';
import { ExifEntity } from '@app/database/entities/exif.entity';
import { TagModule } from '../tag/tag.module';
import { AssetModule } from '../asset/asset.module';
import { UserModule } from '../user/user.module';
import { MicroservicesModule } from 'apps/microservices/src/microservices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExifEntity]),
    ImmichJwtModule,
    TagModule,
    AssetModule,
    UserModule,
    JwtModule.register(jwtConfig),
    MicroservicesModule,
  ],
  controllers: [JobController],
  providers: [JobService, ImmichJwtService],
})
export class JobModule {}
