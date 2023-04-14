import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.enu('role', ['admin', 'user']).notNullable().defaultTo('user');
  });

  await knex.schema.alterTable('participants', (table) => {
    table.dropColumn('status');
    table.dropColumn('location');
  });
  await knex.schema.alterTable('participants', (table) => {
    table
      .enu('status', ['awaitingSigning', 'awaitingApproval', 'approved'])
      .notNullable()
      .defaultTo('awaitingSigning');
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
      .enu('status', ['initialize', 'awaitingApproval', 'approved'])
      .notNullable()
      .defaultTo('initialize');
  });
}
