import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  knex.raw(
    `UPDATE auditTrails 
    SET eventData = JSON_MODIFY(eventData ,'$.participantId',participantId) 
    WHERE participantId is not NULL`
  );

  knex.schema.alterTable('auditTrails', (table) => {
    table.dropColumn('participantId');
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.alterTable('auditTrails', (table) => {
    table.integer('participantId').references('participants.id');
  });

  knex.raw(`UPDATE auditTrails 
            SET participantId = JSON_VALUE(eventData , '$.participantId')
            WHERE JSON_VALUE(eventData , '$.participantId') IS NOT NULL;`);
}
