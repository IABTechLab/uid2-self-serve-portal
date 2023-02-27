import { Model } from 'objection';

import { BaseModel } from './BaseModel';

export interface IUser {}

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
  name!: string;
  email!: string;
  location!: string;
  phone!: string;
}
