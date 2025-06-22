import { Model, RelationMappings } from 'objection';
import { z } from 'zod';

import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

export class ParticipantType extends BaseModel {
  static get tableName() {
    return 'participantTypes';
  }

  static get relationMappings(): RelationMappings {
    return {
      participants: {
        relation: Model.ManyToManyRelation,
        modelClass: () => import('./Participant').then(m => m.Participant) as unknown as typeof Model,
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
  }

  declare id: number;
  declare typeName: string;
}

export type ParticipantTypeDTO = ModelObjectOpt<ParticipantType>;

export const ParticipantTypeData = {
  DSP: { typeName: 'DSP' },
  Advertiser: { typeName: 'Advertiser' },
  DataProvider: { typeName: 'Data Provider' },
  Publisher: { typeName: 'Publisher' },
};

export const ParticipantTypeSchema = z.object({
  id: z.number(),
  typeName: z.string().optional(),
});
