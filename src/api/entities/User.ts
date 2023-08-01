import { Model } from 'objection';
import { z } from 'zod';

import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

export interface IUser {}
export enum UserRole {
  BusinessDevelopment = 'Business Development',
  DA = 'Data / Analytics',
  Marketing = 'Marketing',
  MediaBuyer = 'Media Buyer',
  PM = 'Product Management',
  Engineering = 'Engineering',
  SCRelationships = 'Sales / Client Relationships',
  TechnicalOps = 'Technical Ops',
  Other = 'Other',
}

export class User extends BaseModel {
  static get tableName() {
    return 'users';
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
  email!: string;
  firstName!: string;
  lastName!: string;
  location?: string;
  phone?: string;
  role!: UserRole;
  participantId!: number;
  acceptedTerms!: boolean;
}

export type UserDTO = ModelObjectOpt<User>;

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  location: z.string().optional(),
  phone: z.string().optional(),
  participantId: z.number().optional(),
  role: z.nativeEnum(UserRole).optional(),
  acceptedTerms: z.boolean(),
});

export const UserCreationPartial = UserSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
  location: true,
  phone: true,
  role: true,
  acceptedTerms: true,
});
