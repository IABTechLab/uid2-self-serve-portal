import { Model } from 'objection';
import { z } from 'zod';

import { BaseModel } from './BaseModel';
import { UserScheme } from './User';

export enum ParticipantStatus {
  AwaitingSigning = 'awaiting_signing',
  AwaitingApproval = 'awaiting_approval',
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
          from: 'participants_X_types.participantId',
          to: 'participants_X_types.participantsTypeId',
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
  status!: ParticipantStatus;
}

export const ParticipantSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  status: z.nativeEnum(ParticipantStatus),
  types: z
    .array(
      z.object({
        id: z.number(),
      })
    )
    .optional(),
  users: z.array(UserScheme).optional(),
});
