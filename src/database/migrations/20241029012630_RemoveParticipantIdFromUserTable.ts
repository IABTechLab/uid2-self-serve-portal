import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropForeign('participantId');
  });
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('participantId');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.integer('participantId').references('participants.id');
  });
}
