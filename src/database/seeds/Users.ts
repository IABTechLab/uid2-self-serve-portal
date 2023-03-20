import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { User, UserRole } from '../../api/entities/User';

type UserType = ModelObject<User>;

const sampleData: Optional<UserType, 'id'>[] = [
  { email: 'test@example.com', location: 'Sydney, AU', phone: '+61298765432', role: UserRole.DA },
  {
    email: 'lionell.pack@thetradedesk.com',
    location: 'Sydney, AU',
    phone: '+61298765432',
    role: UserRole.Engineering,
  },
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users')
    .whereIn(
      'email',
      sampleData.map((d) => d.email)
    )
    .del();

  // Inserts seed entries
  await knex('users').insert(sampleData);
}
