import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.boolean('completedRecommendationsWorkflow').defaultTo(false).notNullable();
  });

  // Update existing rows to have the default value for 'completedRecommendationsWorkflow'
  await knex('participants').update({ completedRecommendationsWorkflow: false });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.dropColumn('completedRecommendationsWorkflow');
  });
}
