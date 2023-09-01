import { Model } from 'objection';
import { z } from 'zod';

import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';
import { ParticipantType, ParticipantTypeSchema } from './ParticipantType';
import { User, UserCreationPartial, UserSchema } from './User';

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
    businessContacts: {
      relation: Model.HasManyRelation,
      modelClass: 'BusinessContact',
      join: {
        from: 'participants.id',
        to: 'businessContacts.participantId',
      },
    },
  };
  id!: number;
  name!: string;
  status!: ParticipantStatus;
  allowSharing!: boolean;
  siteId?: number;
  location?: string;
  types?: ParticipantType[];
  users?: User[];
}

// TODO: Can ModelObjectOpt do relationships automatically?
export type ParticipantDTO = Omit<ModelObjectOpt<Participant>, 'types' | 'users'> & {
  types?: ModelObjectOpt<ParticipantType>[];
  users?: ModelObjectOpt<User>[];
};

export const ParticipantSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.nativeEnum(ParticipantStatus),
  types: z.array(ParticipantTypeSchema).optional(),
  users: z.array(UserSchema).optional(),
  allowSharing: z.boolean(),
  location: z.string().optional(),
  siteId: z.number().optional(),
});

export const ParticipantCreationPartial = ParticipantSchema.pick({
  name: true,
  location: true,
}).extend({
  types: z.array(ParticipantTypeSchema.pick({ id: true })),
  users: z.array(UserCreationPartial).optional(),
});

export const ParticipantApprovalPartial = ParticipantSchema.pick({
  siteId: true,
  name: true,
  types: true,
}).extend({
  types: z.array(ParticipantTypeSchema.pick({ id: true })),
});
