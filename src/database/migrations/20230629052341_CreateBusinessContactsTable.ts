import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('businessContacts', (table) => {
    table.increments('id').primary();
    table.string('name', 256).notNullable();
    table.string('emailAlias', 256).notNullable();
    table.string('contactType', 100).notNullable();
    table.integer('participantId').references('participants.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('businessContacts');
}
