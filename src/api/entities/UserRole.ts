import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

export enum UserRoleId {
  Admin = 1,
  Operations = 2,
  UID2Support = 3,
}

export class UserRole extends BaseModel {
  static get tableName() {
    return 'userRoles';
  }
  declare id: number;
  declare roleName: string;
}

export type UserRoleDTO = ModelObjectOpt<UserRole>;
