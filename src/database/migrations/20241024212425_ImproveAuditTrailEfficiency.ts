import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // add index to participantId column
  await knex.schema.alterTable('auditTrails', (table) => {
    table.index('participantId');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('auditTrails', (table) => {
    table.dropIndex('participantId');
  });
}
