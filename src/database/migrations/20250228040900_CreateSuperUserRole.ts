import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('userRoles').insert({
    roleName: 'Super User',
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('userRoles').where({ id: 4 }).del();
}
