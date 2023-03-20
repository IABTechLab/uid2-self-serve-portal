import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('name');
    table.enu('role', ['admin', 'user']).notNullable().defaultTo('user');
  });

  await knex.schema.alterTable('participants', (table) => {
    table.dropColumn('status');
    table.dropColumn('location');
  });
  await knex.schema.alterTable('participants', (table) => {
    table
      .enu('status', ['awaiting_signing', 'awaiting_approval', 'approved'])
      .notNullable()
      .defaultTo('awaiting_signing');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('name', 200);
    table.dropColumn('role');
  });
  await knex.schema.alterTable('participants', (table) => {
    table.string('location');
    table.dropColumn('status');
  });
  await knex.schema.alterTable('participants', (table) => {
    table
      .enu('status', ['initialize', 'awaiting_approval', 'approved'])
      .notNullable()
      .defaultTo('initialize');
  });
}
