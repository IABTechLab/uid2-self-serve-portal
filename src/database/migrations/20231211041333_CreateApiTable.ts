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

  // const siteList = await getSiteList();
  // const siteMap = new Map<number, SiteDTO>(siteList.map((site) => [site.id, site]));

  // const roles = await ApiRole.query();
  // const roleMap = new Map<String, ApiRole>(roles.map((role) => [role.roleName, role]));

  // const participants = await Participant.query();

  // await participants.forEach(async (participant) => {
  //   if (participant.siteId === undefined) return;

  //   const site = siteMap.get(participant.siteId);
  //   if (site === undefined) return;

  //   await site.roles.forEach(async (roleName) => {
  //     // Map to ApiRole or create if not found
  //     let role = roleMap.get(roleName);
  //     if (role === undefined) {
  //       role = await ApiRole.query().insert({
  //         roleName,
  //       });
  //     }

  //     participant.$relatedQuery('roles').relate(role);
  //   });
  // });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('participantsToRoles');
  await knex.schema.dropTableIfExists('apiRoles');
}
