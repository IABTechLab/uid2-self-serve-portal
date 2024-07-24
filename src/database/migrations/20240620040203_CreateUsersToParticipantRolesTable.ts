import { Knex } from 'knex';

interface UsersToParticipants {
  id: number;
  participantId: number;
}

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('usersToParticipantRoles', (table) => {
    table.integer('userId').references('users.id');
    table.integer('participantId').references('participants.id');
    table.primary(['userId', 'participantId']);
  });

  const users = await knex('users').select('id', 'participantId').whereNotNull('participantId');
  if (users.length === 0) return;

  const usersToParticipantRolesData = users.map((user: UsersToParticipants) => ({
    userId: user.id,
    participantId: user.participantId,
  }));

  await knex('usersToParticipantRoles').insert(usersToParticipantRolesData);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('usersToParticipantRoles');
}
