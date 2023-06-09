import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.boolean('acceptedTerms').notNullable().defaultTo(false);
  });

  await knex('users').update({ acceptedTerms: false });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('acceptedTerms');
  });
}
