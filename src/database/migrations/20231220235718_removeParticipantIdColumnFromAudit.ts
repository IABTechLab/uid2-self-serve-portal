import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `UPDATE auditTrails 
    SET eventData = JSON_MODIFY(eventData ,'$.participantId',participantId) 
    WHERE participantId is not NULL`
  );

  await knex.schema.alterTable('auditTrails', (table) => {
    table.dropForeign('participantId');
    table.dropColumn('participantId');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('auditTrails', (table) => {
    table.integer('participantId').references('participants.id');
  });

  await knex.raw(`UPDATE auditTrails 
            SET participantId = JSON_VALUE(eventData , '$.participantId')
            WHERE JSON_VALUE(eventData , '$.participantId') IS NOT NULL;`);
}
