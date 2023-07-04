import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AlbumEntity } from './album.entity';
import { AssetFaceEntity } from './asset-face.entity';
import { ExifEntity } from './exif.entity';
import { LibraryEntity } from './library.entity';
import { SharedLinkEntity } from './shared-link.entity';
import { SmartInfoEntity } from './smart-info.entity';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

@Entity('assets')
// For uploaded assets, each checksum must be unique per user and library
@Index('UQ_uploaded_owner_library_checksum', ['owner', 'library', 'checksum'], {
  unique: true,
  where: '"isReadOnly" IS false',
})
// For all other assets, each originalpath must be unique per user and library
@Unique('UQ_owner_library_originalpath', ['owner', 'library', 'originalPath'])
export class AssetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  deviceAssetId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  owner!: UserEntity;

  @Column()
  ownerId!: string;

  @ManyToOne(() => LibraryEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  library!: LibraryEntity;

  @Column()
  deviceId!: string;

  @Column()
  type!: AssetType;

  @Column()
  originalPath!: string;

  @Column({ type: 'varchar', nullable: true })
  resizePath!: string | null;

  @Column({ type: 'varchar', nullable: true, default: '' })
  webpPath!: string | null;

  @Column({ type: 'bytea', nullable: true })
  thumbhash!: Buffer | null;

  @Column({ type: 'varchar', nullable: true, default: '' })
  encodedVideoPath!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'timestamptz' })
  fileCreatedAt!: Date;

  @Column({ type: 'timestamptz' })
  fileModifiedAt!: Date;

  @Column({ type: 'boolean', default: false })
  isFavorite!: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived!: boolean;

  @Column({ type: 'boolean', default: false })
  isReadOnly!: boolean;

  @Column({ type: 'boolean', default: false })
  isOffline!: boolean;

  @Column({ type: 'varchar', nullable: true })
  mimeType!: string | null;

  @Column({ type: 'bytea' })
  @Index()
  checksum!: Buffer; // sha1 checksum

  @Column({ type: 'varchar', nullable: true })
  duration!: string | null;

  @Column({ type: 'boolean', default: true })
  isVisible!: boolean;

  @OneToOne(() => AssetEntity, { nullable: true, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn()
  livePhotoVideo!: AssetEntity | null;

  @Column({ nullable: true })
  livePhotoVideoId!: string | null;

  @Column({ type: 'varchar' })
  originalFileName!: string;

  @Column({ type: 'varchar', nullable: true })
  sidecarPath!: string | null;

  @OneToOne(() => ExifEntity, (exifEntity) => exifEntity.asset)
  exifInfo?: ExifEntity;

  @OneToOne(() => SmartInfoEntity, (smartInfoEntity) => smartInfoEntity.asset)
  smartInfo?: SmartInfoEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.assets, { cascade: true })
  @JoinTable({ name: 'tag_asset' })
  tags!: TagEntity[];

  @ManyToMany(() => SharedLinkEntity, (link) => link.assets, { cascade: true })
  @JoinTable({ name: 'shared_link__asset' })
  sharedLinks!: SharedLinkEntity[];

  @ManyToMany(() => AlbumEntity, (album) => album.assets, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  albums?: AlbumEntity[];

  @OneToMany(() => AssetFaceEntity, (assetFace) => assetFace.asset)
  faces!: AssetFaceEntity[];
}

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  OTHER = 'OTHER',
}
