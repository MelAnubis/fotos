import { AlbumUserRole } from 'src/entities/album-user.entity';

export const IAccessRepository = 'IAccessRepository';

export type ReadWrite = 'read' | 'write';

export interface IAccessRepository {
  activity: {
    checkOwnerAccess(userId: string, activityIds: Set<string>): Promise<Set<string>>;
    checkAlbumOwnerAccess(userId: string, activityIds: Set<string>): Promise<Set<string>>;
    checkCreateAccess(userId: string, albumIds: Set<string>): Promise<Set<string>>;
  };

  asset: {
    checkOwnerAccess(userId: string, assetIds: Set<string>): Promise<Set<string>>;
    checkAlbumAccess(userId: string, assetIds: Set<string>): Promise<Set<string>>;
    checkPartnerAccess(userId: string, assetIds: Set<string>): Promise<Set<string>>;
    checkSharedLinkAccess(sharedLinkId: string, assetIds: Set<string>): Promise<Set<string>>;
  };

  authDevice: {
    checkOwnerAccess(userId: string, deviceIds: Set<string>): Promise<Set<string>>;
  };

  album: {
    checkOwnerAccess(userId: string, albumIds: Set<string>): Promise<Set<string>>;
    checkSharedAlbumAccess(userId: string, albumIds: Set<string>, access: AlbumUserRole): Promise<Set<string>>;
    checkSharedLinkAccess(sharedLinkId: string, albumIds: Set<string>): Promise<Set<string>>;
  };

  library: {
    checkOwnerAccess(userId: string, libraryIds: Set<string>): Promise<Set<string>>;
  };

  timeline: {
    checkPartnerAccess(userId: string, partnerIds: Set<string>): Promise<Set<string>>;
  };

  memory: {
    checkOwnerAccess(userId: string, memoryIds: Set<string>): Promise<Set<string>>;
  };

  person: {
    checkFaceOwnerAccess(userId: string, assetFaceId: Set<string>): Promise<Set<string>>;
    checkOwnerAccess(userId: string, personIds: Set<string>): Promise<Set<string>>;
  };

  partner: {
    checkUpdateAccess(userId: string, partnerIds: Set<string>): Promise<Set<string>>;
  };
}
