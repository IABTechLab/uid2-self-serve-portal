import { BaseModel } from './BaseModel';

export class UserRole extends BaseModel {
  static get tableName() {
    return 'userRoles';
  }
  declare id: number;
  declare roleName: string;
}

export const ADMIN_USER_ROLE_ID = 1;
