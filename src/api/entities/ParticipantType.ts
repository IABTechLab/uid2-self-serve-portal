import { Model } from 'objection';

import { BaseModel } from './BaseModel';

export class ParticipantType extends BaseModel {
  static get tableName() {
    return 'participantsTypes';
  }
  static relationMappings = {
    participants: {
      relation: Model.ManyToManyRelation,
      modelClass: 'Participant',
      join: {
        from: 'participantsTypes.id',
        through: {
          from: 'participantsXTypes.participantsTypeId',
          to: 'participantsXTypes.participantId',
        },
        to: 'participants.id',
      },
    },
  };
  id!: number;
  typeName!: string;
}
