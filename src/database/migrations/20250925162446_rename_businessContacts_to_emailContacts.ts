import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.renameTable('businessContacts', 'emailContacts');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.renameTable('emailContacts', 'businessContacts');
}
