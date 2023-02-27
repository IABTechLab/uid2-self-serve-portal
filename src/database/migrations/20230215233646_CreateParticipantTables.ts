import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('participants_types', (table) => {
    table.increments('id').primary();
    table.string('type_name', 100).notNullable();
  });

  await knex.schema.createTable('participants', (table) => {
    table.increments('id').primary();
    table.string('name', 256).notNullable();
    table.string('location', 100);
    table.enu('status', ['initialize', 'awaiting_approval', 'approved']).notNullable();
  });

  await knex.schema.createTable('participants_X_types', (table) => {
    table.integer('participant_id').references('participants.id').onDelete('CASCADE');
    table
      .integer('participants_type_id')
      .references('id')
      .inTable('participants_types')
      .onDelete('CASCADE');
    table.primary(['participant_id', 'participants_type_id']);
  });

  await knex.schema.alterTable('users', (table) => {
    table.integer('participant_id').unsigned();
    table.foreign('participant_id').references('participants.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.alterTable('users', (table) => {
    table.dropColumn('participant_id');
    table.dropForeign('participant_id');
  });
  await knex.schema.dropTableIfExists('participants_X_types');
  await knex.schema.dropTableIfExists('participants');
  await knex.schema.dropTableIfExists('participants_types');
}
