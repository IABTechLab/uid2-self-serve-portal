import { Knex } from 'knex';

interface PrimaryUserData {
  userId: number;
  participantId: number;
}

export async function up(knex: Knex): Promise<void> {
  const eligibleUsers = (await knex('usersToParticipantRoles')
    .join('users', 'users.id', '=', 'usersToParticipantRoles.userId')
    .select('usersToParticipantRoles.participantId', 'users.id as userId')
    .where('users.deleted', 0)
    .where('users.locked', 0)
    .whereNot('usersToParticipantRoles.userRoleId', 2)) as PrimaryUserData[]; // exclude Operations role;

  if (eligibleUsers.length === 0) return;

  const primaryContactsMap = new Map<number, number>();
  for (const user of eligibleUsers) {
    if (!primaryContactsMap.has(user.participantId)) {
      primaryContactsMap.set(user.participantId, user.userId);
    }
  }

  const dataObjectToSqlArray = Array.from(primaryContactsMap.entries()).map(
    ([participantId, userId]) => ({
      userId,
      participantId,
    })
  );

  await knex('primaryContacts').insert(dataObjectToSqlArray);
}

export async function down(knex: Knex): Promise<void> {
  await knex('primaryContacts')
    .whereIn('participantId', knex('usersToParticipantRoles').distinct('participantId'))
    .del();
}
