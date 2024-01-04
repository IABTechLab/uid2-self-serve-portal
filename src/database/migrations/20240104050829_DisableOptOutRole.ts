import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('apiRoles', (table) => {
    table.boolean('disabled').defaultTo(true).notNullable();
  });

  const allowedRoles = ['MAPPER', 'GENERATOR', 'ID_READER', 'SHARER'];

  await knex('apiRoles').whereIn('roleName', allowedRoles).update({ disabled: false });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('apiRoles', (table) => {
    table.dropColumn('disabled');
  });
}
