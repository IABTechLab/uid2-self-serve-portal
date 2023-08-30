import { Model } from 'objection';
import { z } from 'zod';

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
  id!: number;
  typeName!: string;
}

export type ParticipantTypeDTO = ModelObjectOpt<ParticipantType>;

// TODO: How do we sync these with the database?
export const ParticipantTypeData = {
  DSP: { typeName: 'DSP', id: 1 },
  Advertiser: { typeName: 'Advertiser', id: 2 },
  DataProvider: { typeName: 'Data Provider', id: 3 },
  Publisher: { typeName: 'Publisher', id: 4 },
};

export const ParticipantTypeSchema = z.object({
  id: z.number(),
  typeName: z.string().optional(),
});
