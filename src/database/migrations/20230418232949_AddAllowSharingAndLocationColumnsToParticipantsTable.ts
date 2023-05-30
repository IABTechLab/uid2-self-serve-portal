import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.boolean('allowSharing').defaultTo(true);
    table.string('location', 100);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.dropColumn('allowSharing');
    table.dropColumn('location');
  });
}
