import { User } from '@app/common';

export class UserResponseDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  createdAt!: string;
  profileImagePath!: string;
  shouldChangePassword!: boolean;
  isAdmin!: boolean;
  deletedAt?: Date;
}

export function mapUser(entity: User): UserResponseDto {
  return {
    id: entity.id,
    email: entity.email,
    firstName: entity.firstName,
    lastName: entity.lastName,
    createdAt: entity.createdAt,
    profileImagePath: entity.profileImagePath,
    shouldChangePassword: entity.shouldChangePassword,
    isAdmin: entity.isAdmin,
    deletedAt: entity.deletedAt,
  };
}
