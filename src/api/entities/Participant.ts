import { Model } from 'objection';

import { BaseModel } from './BaseModel';

export class Participant extends BaseModel {
  static get tableName() {
    return 'participants';
  }
  static relationMappings = {
    types: {
      relation: Model.ManyToManyRelation,
      modelClass: 'ParticipantType',
      join: {
        from: 'participants.id',
        through: {
          from: 'participantsXTypes.participantId',
          to: 'participantsXTypes.participantsTypeId',
        },
        to: 'participantsTypes.id',
      },
    },
    users: {
      relation: Model.HasManyRelation,
      modelClass: 'User',
      join: {
        from: 'participants.id',
        to: 'users.participantId',
      },
    },
  };
  id!: number;
  name!: string;
  location!: string;
  status!: string;
}
