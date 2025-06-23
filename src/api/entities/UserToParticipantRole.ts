import { Model, RelationMappings } from 'objection';

import type { UserRole } from './UserRole';

export class UserToParticipantRole extends Model {
  static get tableName() {
    return 'usersToParticipantRoles';
  }

  static get idColumn() {
    return ['userId', 'participantId', 'userRoleId'];
  }

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
				// eslint-disable-next-line import/no-cycle
        modelClass: () => import('./User').then(m => m.User) as unknown as typeof Model,
        join: {
          from: 'usersToParticipantRoles.userId',
          to: 'users.id',
        },
      },
      participant: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => import('./Participant').then(m => m.Participant) as unknown as typeof Model,
        join: {
          from: 'usersToParticipantRoles.participantId',
          to: 'participants.id',
        },
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => import('./UserRole').then(m => m.UserRole) as unknown as typeof UserRole,
        join: {
          from: 'usersToParticipantRoles.userRoleId',
          to: 'userRoles.id',
        },
      },
    };
  }

  declare userId: number;
  declare participantId: number;
  declare userRoleId: number;
}
