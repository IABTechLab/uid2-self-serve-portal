import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participantsToTypes', (table) => {
    table.dropForeign('participantTypeId');
    table.foreign('participantTypeId').references('participantTypes.id').onDelete('NO ACTION');
  });

  await knex.schema.alterTable('approvers', (table) => {
    table.dropForeign('participantTypeId');
    table.foreign('participantTypeId').references('participantTypes.id').onDelete('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participantsToTypes', (table) => {
    table.dropForeign('participantTypeId');
    table.foreign('participantTypeId').references('participantTypes.id').onDelete('CASCADE');
  });

  await knex.schema.alterTable('approvers', (table) => {
    table.dropForeign('participantTypeId');
    table.foreign('participantTypeId').references('participantTypes.id').onDelete('CASCADE');
  });
}
