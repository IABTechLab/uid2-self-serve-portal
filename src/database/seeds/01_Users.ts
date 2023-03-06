import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { User } from '../../api/entities/User';

type UserType = ModelObject<User>;

const sampleData: Optional<UserType, 'id'>[] = [
  { email: 'test@example.com', location: 'Sydney, AU', name: 'Test User', phone: '+61298765432' },
  {
    email: 'lionell.pack@thetradedeskexample.com',
    location: 'Sydney, AU',
    name: 'Lionell Pack (TTD)',
    phone: '+61298765432',
  },
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').whereILike('email', '%example.com').del();

  // Inserts seed entries
  await knex('users').insert(sampleData);
}
