import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('apiRoles', (table) => {
    table.string('externalName', 128);
  });

  await knex('apiRoles').where({ roleName: 'GENERATOR' }).update({ externalName: 'Token Creator' });
  await knex('apiRoles').where({ roleName: 'MAPPER' }).update({ externalName: 'UID2 Creator' });
  await knex('apiRoles').where({ roleName: 'ID_READER' }).update({ externalName: 'Decryptor' });
  await knex('apiRoles').where({ roleName: 'SHARER' }).update({ externalName: 'Securer' });
  await knex('apiRoles').where({ roleName: 'OPTOUT' }).update({ externalName: 'Opt-Out' });

  await knex('apiRoles')
    .whereNull('externalName')
    .update({ externalName: knex.ref('roleName') });

  await knex.schema.alterTable('apiRoles', (table) => {
    table.dropNullable('externalName');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('apiRoles', (table) => {
    table.dropColumn('externalName');
  });
}
