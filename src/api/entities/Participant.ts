import { Model } from 'objection';
import { z } from 'zod';

import { BaseModel } from './BaseModel';
import { ParticipantTypeSchema } from './ParticipantType';
import { UserScheme } from './User';

export enum ParticipantStatus {
  AwaitingSigning = 'awaitingSigning',
  AwaitingApproval = 'awaitingApproval',
  Approved = 'approved',
}

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
          from: 'participantsToTypes.participantId',
          to: 'participantsToTypes.participantTypeId',
        },
        to: 'participantTypes.id',
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
  status!: ParticipantStatus;
}

export const ParticipantSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  status: z.nativeEnum(ParticipantStatus),
  types: z.array(ParticipantTypeSchema).optional(),
  users: z.array(UserScheme).optional(),
});
