import { Model } from 'objection';

export interface IUser {}

export class User extends Model {
  static get tableName() {
    return 'users';
  }
  id!: number;
  name!: string;
  email!: string;
  location!: string;
  phone!: string;
}
