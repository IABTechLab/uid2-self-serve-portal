import { Model } from 'objection';

export class UserToParticipantRole extends Model {
  static get tableName() {
    return 'usersToParticipantRoles';
  }
  static get idColumn() {
    return ['userId', 'participantId', 'userRoleId'];
  }
  static readonly relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'usersToParticipantRoles.userId',
        to: 'users.id',
      },
    },
    participant: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Participant',
      join: {
        from: 'usersToParticipantRoles.participantId',
        to: 'participants.id',
      },
    },
    role: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'UserRole',
      join: {
        from: 'usersToParticipantRoles.userRoleId',
        to: 'userRoles.id',
      },
    },
  };
  declare userId: number;
  declare participantId: number;
  declare userRoleId: number;
}
