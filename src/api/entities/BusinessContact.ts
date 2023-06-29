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
  static relationMappings = {
    participant: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Participant',
      join: {
        from: 'users.participantId',
        to: 'participants.id',
      },
    },
  };

  id!: number;
  name!: string;
  emailAlias!: string;
  contactType!: string;
}

export const BusinessContactSchema = z.object({
  id: z.number(),
  name: z.string(),
  emailAlias: z.string(),
  contactType: z.nativeEnum(ContactType),
  participantId: z.number(),
});

export const BusinessContactsCreation = BusinessContactSchema.omit({
  id: true,
  participantId: true,
});
