import { Knex } from 'knex';

import { ApiRole } from '../../api/entities/ApiRole';
import { Participant } from '../../api/entities/Participant';
import { getSiteList } from '../../api/services/adminServiceClient';
import { SiteDTO } from '../../api/services/adminServiceHelpers';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('apiRoles', (table) => {
    table.increments('id').primary();
    table.string('roleName', 100).notNullable();
  });

  // Add default roles
  const defaultRoles = ['MAPPER', 'GENERATOR', 'ID_READER', 'SHARER', 'OPTOUT'];
  await knex('apiRoles').insert(
    defaultRoles.map((role) => {
      return { roleName: role };
    })
  );

  await knex.schema.createTable('participantsToRoles', (table) => {
    table.integer('participantId').references('participants.id').onDelete('CASCADE');
    table.integer('apiRoleId').references('id').inTable('apiRoles').onDelete('CASCADE');
    table.primary(['participantId', 'apiRoleId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('participantsToRoles');
  await knex.schema.dropTableIfExists('apiRoles');
}
