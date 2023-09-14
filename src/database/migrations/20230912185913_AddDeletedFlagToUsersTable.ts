import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.boolean('deleted').defaultTo(false).notNullable();
  });

  // Update existing rows to have the default value for 'deleted'
  await knex('users').update({ deleted: false });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('deleted');
  });
}
