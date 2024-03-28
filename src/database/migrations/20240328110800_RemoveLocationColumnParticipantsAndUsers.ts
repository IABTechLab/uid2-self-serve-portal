import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.dropColumn('location');
  });
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('location');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.string('location', 100);
  });
  await knex.schema.alterTable('users', (table) => {
    table.string('location', 100);
  });
}
