import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.boolean('completedRecommendations').defaultTo(false).notNullable();
  });

  // Update existing rows to have the default value for 'completedRecommendations'
  await knex('participants').update({ completedRecommendations: false });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.dropColumn('completedRecommendations');
  });
}
