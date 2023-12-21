import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('auditTrails')
    .whereNotNull('participantId')
    .update({
      eventData: knex.raw("JSON_MODIFY(eventData, '$.participantId', ?)", [
        knex.ref('participantId'),
      ]),
    });

  await knex.schema.alterTable('auditTrails', (table) => {
    table.dropForeign('participantId');
    table.dropColumn('participantId');
  });

  await knex.schema.alterTable('businessContacts', (table) => {
    table.dropForeign('participantId');
    table.foreign('participantId').references('participants.id').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('auditTrails', (table) => {
    table.integer('participantId').references('participants.id');
  });

  await knex('auditTrails')
    .whereExists(
      knex
        .select('*')
        .from('participants')
        .whereRaw("participants.id = JSON_VALUE(auditTrails.eventData, '$.participantId')")
    )
    .update({
      participantId: knex.raw("JSON_VALUE(eventData, '$.participantId')"),
      eventData: knex.raw("JSON_MODIFY(eventData, '$.participantId', null)"),
    });

  await knex.schema.alterTable('businessContacts', (table) => {
    table.dropForeign('participantId');
    table.foreign('participantId').references('participants.id');
  });
}
