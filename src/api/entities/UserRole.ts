import { BaseModel } from './BaseModel';

export class UserRole extends BaseModel {
  static get tableName() {
    return 'userRoles';
  }
  // TODO Consider if I need this relationMapping
  // static readonly relationMappings = {
  //   user: {
  //     relation: Model.ManyToManyRelation,
  //     modelClass: 'User',
  //     join: {
  //       from: 'userRoles.id',
  //       through: {
  //         from: 'usersToParticipantRoles.userRoleId',
  //         to: 'usersToParticipantRoles.userId',
  //       },
  //       to: 'users.id',
  //     },
  //   },
  // };
  declare id: number;
  declare roleName: string;
}

export const ADMIN_USER_ROLE_ID = 1;
