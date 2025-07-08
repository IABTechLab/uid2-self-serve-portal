import { Knex } from 'knex';

interface PrimaryContactData {
  participantId: number;
  userId: number;
}

export async function up(knex: Knex): Promise<void> {
  const baseUserQuery = knex('usersToParticipantRoles')
    .join('users', 'users.id', '=', 'usersToParticipantRoles.userId')
    .select('usersToParticipantRoles.participantId', 'users.id as userId');

  const validUsers = (await baseUserQuery
    .clone()
    .where('users.deleted', 0)
    .where('users.locked', 0)) as PrimaryContactData[];
  if (!validUsers.length) return;

  const eligibleUsers = (await baseUserQuery
    .clone()
    .whereNot('usersToParticipantRoles.userRoleId', 2)) as PrimaryContactData[]; // exclude Operations role;
  if (!eligibleUsers.length) return;

  const primaryContactsMap = new Map<number, number>();
  for (const user of eligibleUsers) {
    if (!primaryContactsMap.has(user.participantId)) {
      primaryContactsMap.set(user.participantId, user.userId);
    }
  }

  const dataObjectToSqlArray = Array.from(primaryContactsMap.entries()).map(
    ([participantId, userId]) => ({
      participantId,
      userId,
    })
  );

  await knex('primaryContacts').insert(dataObjectToSqlArray);
}

export async function down(knex: Knex): Promise<void> {
  await knex('primaryContacts')
    .whereIn('participantId', knex('usersToParticipantRoles').distinct('participantId'))
    .del();
}
