import { Knex } from 'knex';

interface UserToPrimary {
  userId: number;
  participantId: number;
}

export async function up(knex: Knex): Promise<void> {
  // Step 1: Fetch valid users from usersToParticipantRoles
  const rows = (await knex('usersToParticipantRoles')
    .join('users', 'users.id', '=', 'usersToParticipantRoles.userId') // get full user info for filtering
    .select('usersToParticipantRoles.participantId', 'users.id as userId')
    .where('users.deleted', 0)
    .where('users.locked', 0)) as UserToPrimary[];
  // TO CONFIRM: do we want filter by certain roles (Admin) ?

  if (rows.length === 0) return;

  // Step 2: Add first user and track unique participants
  const primaryContactsMap = new Map<number, number>();
  for (const row of rows) {
    if (!primaryContactsMap.has(row.participantId)) {
      primaryContactsMap.set(row.participantId, row.userId);
    }
  }

  // Step 3: Translate map to SQL array
  const dataToInsert = Array.from(primaryContactsMap.entries()).map(([participantId, userId]) => ({
    userId,
    participantId,
  }));

  await knex('primaryContacts').insert(dataToInsert);
}

export async function down(knex: Knex): Promise<void> {
  knex('primaryContacts')
    .whereIn('participantId', knex('usersToParticipantRoles').distinct('participantId'))
    .del();
}
