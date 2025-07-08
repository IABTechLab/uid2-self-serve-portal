import { Knex } from 'knex';

interface PrimaryContactRow {
  participantId: number;
  userId: number;
}

export async function up(knex: Knex): Promise<void> {
  // Step 1: Fetch rows from usersToParticipantRoles with valid users
  const rows = await knex('usersToParticipantRoles')
    .join('users', 'users.id', '=', 'usersToParticipantRoles.userId') // get full user info for filtering
    .select('usersToParticipantRoles.participantId', 'users.id as userId')
    .where('users.deleted', 0)
    .where('users.locked', 0);
  // do we want filter by certain roles (Admin) ?

  // Step 2: Add first user who appears for each unique participant to map
  const primaryContactsMap = new Map<number, number>();
  for (const row of rows) {
    if (!primaryContactsMap.has(row.participantId)) {
      primaryContactsMap.set(row.participantId, row.userId);
    }
  }

  // Step 3: Translate map to insertable array
  const dataToInsert = Array.from(primaryContactsMap.entries()).map(([participantId, userId]) => ({
    userId,
    participantId,
  }));

  // Step 4: Insert data
  if (dataToInsert.length > 0) {
    await knex('primaryContacts').insert(dataToInsert);
  }
}

export async function down(knex: Knex): Promise<void> {
  knex('primaryContacts')
    .whereIn('participantId', knex('usersToParticipantRoles').distinct('participantId'))
    .del();
}
