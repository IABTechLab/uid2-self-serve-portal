import Objection, { Model, RelationMappings } from 'objection';

import { BaseModel } from './BaseModel.ts';
import { ModelObjectOpt } from './ModelObjectOpt.ts';
import { Participant } from './Participant.ts';
import { UserToParticipantRole } from './UserToParticipantRole.ts';

export interface IUser {}
export enum UserJobFunction {
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

  static get relationMappings(): RelationMappings {
		return {
			participants: {
				relation: Model.ManyToManyRelation,
				modelClass: () => Participant,
				join: {
					from: 'users.id',
					through: {
						from: 'usersToParticipantRoles.userId',
						to: 'usersToParticipantRoles.participantId',
					},
					to: 'participants.id',
				},
			},
			userToParticipantRoles: {
				relation: Model.HasManyRelation,
				modelClass: () => UserToParticipantRole,
				join: {
					from: 'users.id',
					to: 'usersToParticipantRoles.userId',
				},
			},
		};
  };

  declare id: number;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare phone?: string;
  declare jobFunction: UserJobFunction;
  declare participants?: Participant[];
  declare acceptedTerms: boolean;
  declare locked?: boolean;
  declare userToParticipantRoles?: UserToParticipantRole[];

  static readonly modifiers = {
    withParticipants<TResult>(query: Objection.QueryBuilder<User, TResult>) {
      const myQuery = query.withGraphFetched(
        '[participants.participantToUserRoles]'
      ) as Objection.QueryBuilder<User, TResult & { participants: Participant[] }>;
      return myQuery;
    },
  };
}

export type UserDTO = ModelObjectOpt<User>;

export type UserCreationDTO = Omit<ModelObjectOpt<UserDTO>, 'id'>;
