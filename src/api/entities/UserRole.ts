import { BaseModel } from './BaseModel.ts';
import { ModelObjectOpt } from './ModelObjectOpt.ts';

export enum UserRoleId {
  Admin = 1,
  Operations = 2,
  UID2Support = 3,
  SuperUser = 4,
}

export const getUserRoleById = (id: number) => {
  switch (id) {
    case 1:
      return 'Admin';
    case 2:
      return 'Operations';
    case 3:
      return 'Support';
    case 4:
      return 'SuperUser';
    default:
      return 'Invalid';
  }
};

export class UserRole extends BaseModel {
  static get tableName() {
    return 'userRoles';
  }
  declare id: number;
  declare roleName: string;
}

export type UserRoleDTO = ModelObjectOpt<UserRole>;
