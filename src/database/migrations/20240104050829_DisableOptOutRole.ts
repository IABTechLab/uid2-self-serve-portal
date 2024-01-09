import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('apiRoles', (table) => {
    table.boolean('disabled').defaultTo(true).notNullable();
  });

  const enabledRoles = ['MAPPER', 'GENERATOR', 'ID_READER', 'SHARER'];

  await knex('apiRoles').whereIn('roleName', enabledRoles).update({ disabled: false });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('apiRoles', (table) => {
    table.dropColumn('disabled');
  });
}
