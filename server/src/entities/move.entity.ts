import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('move_history')
// path lock (per entity)
@Unique('UQ_entityId_pathType', ['entityId', 'pathType'])
// new path lock (global)
@Unique('UQ_newPath', ['newPath'])
export class MoveEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  entityId!: string;

  @Column({ type: 'varchar' })
  pathType!: PathType;

  @Column({ type: 'varchar' })
  oldPath!: string;

  @Column({ type: 'varchar' })
  newPath!: string;
}

export enum AssetPathType {
  ORIGINAL = 'original',
  PREVIEW = 'preview',
  THUMBNAIL = 'thumbnail',
  ENCODED_VIDEO = 'encoded_video',
  SIDECAR = 'sidecar',
  WATERMARKED_PREVIEW = 'watermarked_preview',
  WATERMARKED_THUMBNAIL = 'watermarked_thumbnail',
}

export enum PersonPathType {
  FACE = 'face',
}

export enum UserPathType {
  PROFILE = 'profile',
}

export type PathType = AssetPathType | PersonPathType | UserPathType;
