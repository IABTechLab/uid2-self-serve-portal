import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.boolean('allowSharing').defaultTo(true);
    table.string('location', 100);
  });

  // Update existing rows to have the default value for 'allowSharing'
  await knex('participants').update({ allowSharing: true });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.dropColumn('allowSharing');
    table.dropColumn('location');
  });
}
