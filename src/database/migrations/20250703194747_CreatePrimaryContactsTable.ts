import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('primaryContacts', (table) => {
    table.integer('participantId').references('participants.id').unique();
    table.integer('userId').references('users.id');
    table.primary(['userId', 'participantId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('primaryContacts');
}
