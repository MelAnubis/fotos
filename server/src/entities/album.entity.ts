import { AssetEntity } from 'src/entities/asset.entity';
import { SharedLinkEntity } from 'src/entities/shared-link.entity';
import { UserEntity } from 'src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// ran into issues when importing the enum from `asset.dto.ts`
export enum AssetOrder {
  ASC = 'asc',
  DESC = 'desc',
}

@Entity('albums')
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  owner!: UserEntity;

  @Column()
  ownerId!: string;

  @Column({ default: 'Untitled Album' })
  albumName!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: Date | null;

  @ManyToOne(() => AssetEntity, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  albumThumbnailAsset!: AssetEntity | null;

  @Column({ comment: 'Asset ID to be used as thumbnail', nullable: true })
  albumThumbnailAssetId!: string | null;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'albums_shared_users_users',
    inverseJoinColumn: {
      name: 'usersId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_f48513bf9bccefd6ff3ad30bd06',
    },
    joinColumn: {
      name: 'albumsId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_427c350ad49bd3935a50baab737',
    },
  })
  sharedUsers!: UserEntity[];

  @ManyToMany(() => AssetEntity, (asset) => asset.albums)
  @JoinTable()
  assets!: AssetEntity[];

  @OneToMany(() => SharedLinkEntity, (link) => link.album)
  sharedLinks!: SharedLinkEntity[];

  @Column({ default: true })
  isActivityEnabled!: boolean;

  @Column({ type: 'varchar', default: AssetOrder.DESC })
  order!: AssetOrder;
}
