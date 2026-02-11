import { Knex } from 'knex';

const SUPER_USER_ROLE_ID = 4;

export async function up(knex: Knex): Promise<void> {
  // Step 1: Delete all entries in usersToParticipantRoles where userRoleId = 4 (Super User)
  await knex('usersToParticipantRoles').where('userRoleId', SUPER_USER_ROLE_ID).del();

  // Step 2: Delete the Super User role from userRoles table
  await knex('userRoles').where('id', SUPER_USER_ROLE_ID).del();
}

export async function down(knex: Knex): Promise<void> {
  // Re-create the Super User role
  await knex('userRoles').insert({
    id: SUPER_USER_ROLE_ID,
    roleName: 'Super User',
  });
}
