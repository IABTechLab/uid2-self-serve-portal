import Objection, { Model } from 'objection';
import { z } from 'zod';

import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';
import type { Participant } from './Participant';

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

  static get virtualAttributes() {
    return ['fullName'];
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  static readonly relationMappings = {
    participants: {
      relation: Model.ManyToManyRelation,
      modelClass: 'Participant',
      join: {
        from: 'users.id',
        through: {
          from: 'usersToParticipantRoles.userId',
          to: 'usersToParticipantRoles.participantId',
        },
        to: 'participants.id',
      },
    },
  };

  declare id: number;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare phone?: string;
  declare role: UserRole;
  declare participants?: Participant[];
  declare acceptedTerms: boolean;

  static readonly modifiers = {
    withParticipants<TResult>(query: Objection.QueryBuilder<User, TResult>) {
      const myQuery = query.withGraphFetched('participants') as Objection.QueryBuilder<
        User,
        TResult & { participants: Participant[] }
      >;
      return myQuery;
    },
  };
}

export type UserDTO = ModelObjectOpt<User>;

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  acceptedTerms: z.boolean(),
});

export const UserCreationPartial = UserSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  acceptedTerms: true,
});
