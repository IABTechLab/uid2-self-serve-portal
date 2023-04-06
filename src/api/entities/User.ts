import { Model, ModelObject } from 'objection';
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
}

export type UserDTO = ModelObjectOpt<User>;

export const UserScheme = z.object({
  id: z.number().optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  location: z.string().optional(),
  phone: z.string().optional(),
  participantId: z.number().optional(),
  role: z.nativeEnum(UserRole).optional(),
});
