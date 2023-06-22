import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.integer('siteId').unique();
  });

  await knex.schema.createTable('sharingAuditTrails', (table) => {
    table.increments('id').primary();
    table.integer('participantId').references('participants.id');
    table.integer('userId').references('users.id');
    table.string('userEmail');
    table.integer('sharingParticipantSiteId');
    table.enu('action', ['add', 'delete']);
    table.boolean('proceed').defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('sharingAuditTrails');
  await knex.schema.alterTable('participants', (table) => {
    table.dropUnique([], 'participants_siteid_unique');
    table.dropColumn('siteId');
  });
}
