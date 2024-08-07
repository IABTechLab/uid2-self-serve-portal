import { Knex } from 'knex';

type UserToParticipantRole = {
  userId: number;
  participantId: number;
  userRoleId: number;
};

type UserToParticipant = Omit<UserToParticipantRole, 'userRoleId'>;

const UID2_SUPPORT_USER_ROLE_ID = 3;

const getAllApproverUserIds = async (knex: Knex) => {
  // Find all approvers
  const approvers = await knex('approvers').distinct('email');
  const approverEmails = approvers.map((approver) => approver.email);

  // Retrieve their user IDs
  const approverUsers = await knex('users').whereIn('email', approverEmails);
  return approverUsers.map((user) => user.id);
};

export async function up(knex: Knex): Promise<void> {
  const approverUserIds = await getAllApproverUserIds(knex);

  if (approverUserIds.length === 0) {
    return;
  }

  // Find the lowest participantId for each userId
  const usersToParticipants: UserToParticipant[] = await knex('usersToParticipantRoles')
    .select('userId')
    .min('participantId as participantId')
    .whereIn('userId', approverUserIds)
    .groupBy('userId');

  // Populate usersToParticipantRoles with a new row for the support user role id
  await knex('usersToParticipantRoles').insert(
    usersToParticipants.map((userToParticipant) => {
      const data: UserToParticipantRole = {
        userId: userToParticipant.userId,
        participantId: userToParticipant.participantId,
        userRoleId: UID2_SUPPORT_USER_ROLE_ID,
      };
      return data;
    })
  );
}

export async function down(knex: Knex): Promise<void> {
  const approverUserIds = await getAllApproverUserIds(knex);

  if (approverUserIds.length === 0) {
    return;
  }

  await knex('usersToParticipantRoles')
    .whereIn('userId', approverUserIds)
    .where('userRoleId', '=', UID2_SUPPORT_USER_ROLE_ID)
    .del();
}
