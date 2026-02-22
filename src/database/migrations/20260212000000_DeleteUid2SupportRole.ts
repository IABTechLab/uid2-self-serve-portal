import { Knex } from 'knex';

const UID2_SUPPORT_ROLE_ID = 3;

export async function up(knex: Knex): Promise<void> {
  await knex('usersToParticipantRoles').where('userRoleId', UID2_SUPPORT_ROLE_ID).del();
  await knex('userRoles').where('id', UID2_SUPPORT_ROLE_ID).del();
}

export async function down(knex: Knex): Promise<void> {
  await knex('userRoles').insert({
    id: UID2_SUPPORT_ROLE_ID,
    roleName: 'UID2 Support',
  });
}
