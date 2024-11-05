import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('approvers');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable('approvers', (table) => {
    table.increments('id').primary();
    table.string('displayName', 256);
    table.string('email', 256).notNullable();
    table
      .integer('participantTypeId')
      .references('id')
      .inTable('participantTypes')
      .onDelete('CASCADE');
  });
}
