import { Model } from 'objection';
import { z } from 'zod';

import { BaseModel } from './BaseModel';

export enum ContactType {
  Business = 'Business',
  Technical = 'Technical',
}

export class BusinessContact extends BaseModel {
  static get tableName() {
    return 'businessContacts';
  }
  static readonly relationMappings = {
    participant: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Participant',
      join: {
        from: 'users.id',
        through: {
          from: 'usersToParticipants.userId',
          to: 'usersToParticipants.participantId',
        },
        to: 'participants.id',
      },
    },
  };

  declare id: number;
  declare name: string;
  declare emailAlias: string;
  declare contactType: string;
  declare participantId: number;
}

export const BusinessContactSchema = z.object({
  id: z.number(),
  name: z.string(),
  emailAlias: z.string(),
  contactType: z.nativeEnum(ContactType),
  participantId: z.number(),
});
