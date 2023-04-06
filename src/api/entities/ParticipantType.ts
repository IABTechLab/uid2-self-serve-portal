import { Model } from 'objection';

import { BaseModel } from './BaseModel';

export class ParticipantType extends BaseModel {
  static get tableName() {
    return 'participantTypes';
  }
  static relationMappings = {
    participants: {
      relation: Model.ManyToManyRelation,
      modelClass: 'Participant',
      join: {
        from: 'participantTypes.id',
        through: {
          from: 'participantsToTypes.participantTypeId',
          to: 'participantsToTypes.participantId',
        },
        to: 'participants.id',
      },
    },
  };
  id!: number;
  typeName!: string;
}
