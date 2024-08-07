import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add the new column, initially nullable
  await knex.schema.alterTable('usersToParticipantRoles', (table) => {
    table.integer('userRoleId');
    table.foreign('userRoleId').references('userRoles.id');
  });

  // Populate new column
  const adminUserRoleId = 1;
  await knex('usersToParticipantRoles').update({ userRoleId: adminUserRoleId });

  // Make it not nullable and add to PK
  await knex.schema.alterTable('usersToParticipantRoles', (table) => {
    table.integer('userRoleId').notNullable().alter();
    table.dropPrimary();
    table.primary(['userId', 'participantId', 'userRoleId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('usersToParticipantRoles', (table) => {
    table.dropForeign('userRoleId');
    table.dropPrimary();
    table.dropColumn('userRoleId');
    table.primary(['userId', 'participantId']);
  });
}
