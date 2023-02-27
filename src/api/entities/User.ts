import { Model } from 'objection';

import { BaseModel } from './BaseModel';

export interface IUser {}

export class User extends BaseModel {
  static get tableName() {
    return 'users';
  }
  static relationMappings = {
    participants: {
      relation: Model.ManyToManyRelation,
      modelClass: 'Participant',
      join: {
        from: 'users.id',
        through: {
          from: 'usersXParticipants.userId',
          to: 'usersXParticipants.participantId',
        },
        to: 'participants.id',
      },
    },
  };
  id!: number;
  name!: string;
  email!: string;
  location!: string;
  phone!: string;
}
