/* eslint-disable camelcase */
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('participantTypes', (table) => {
    table.increments('id').primary();
    table.string('typeName', 100).notNullable();
  });

  await knex('participantTypes').insert([
    { typeName: 'DSP' },
    {
      typeName: 'Advertiser',
    },
    {
      typeName: 'Data Provider',
    },
    {
      typeName: 'Publisher',
    },
  ]);
  await knex.schema.createTable('participants', (table) => {
    table.increments('id').primary();
    table.string('name', 256).notNullable();
    table.string('location', 100);
    table.enu('status', ['initialize', 'awaitingApproval', 'approved']).notNullable();
  });

  await knex.schema.createTable('participantsToTypes', (table) => {
    table.integer('participantId').references('participants.id').onDelete('CASCADE');
    table
      .integer('participantTypeId')
      .references('id')
      .inTable('participantTypes')
      .onDelete('CASCADE');
    table.primary(['participantId', 'participantTypeId']);
  });

  await knex.schema.alterTable('users', (table) => {
    table.integer('participantId').unsigned();
    table.foreign('participantId').references('participants.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropForeign('participantId');
    table.dropColumn('participantId');
  });

  await knex.schema.dropTableIfExists('participantsToTypes');
  await knex.schema.dropTableIfExists('participantTypes');
  await knex.schema.dropTableIfExists('participants');
}
