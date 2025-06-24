import { Model } from 'objection';

import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

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
  declare id: number;
  declare typeName: string;
}

export type ParticipantTypeDTO = ModelObjectOpt<ParticipantType>;

// TODO: How do we sync these with the database? I've omitted ID for now to make things safer
export const ParticipantTypeData = {
  DSP: { typeName: 'DSP' },
  Advertiser: { typeName: 'Advertiser' },
  DataProvider: { typeName: 'Data Provider' },
  Publisher: { typeName: 'Publisher' },
};
