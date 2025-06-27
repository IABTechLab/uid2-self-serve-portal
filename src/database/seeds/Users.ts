import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { User, UserJobFunction } from '../../api/entities/User.ts';
import { UserRoleId } from '../../api/entities/UserRole.ts';
import { CreateParticipant } from './Participants.ts';

type UserType = ModelObject<User>;

const sampleParticipant = {
  name: 'Test Participant',
  allowSharing: true,
  type: 'Publisher',
  siteId: 999,
  apiRoleNames: ['GENERATOR', 'SHARER'],
  completedRecommendations: false,
  crmAgreementNumber: '86753099',
  dateApproved: new Date('2023-08-15 18:48:16.2000000'),
};
const sampleUserData: Optional<UserType, 'id'>[] = [
  {
    email: 'test_user@example.com',
    firstName: 'Test',
    lastName: 'User',
    phone: '+61298765432',
    jobFunction: UserJobFunction.Engineering,
    acceptedTerms: true,
  },
];

export async function seed(knex: Knex): Promise<void> {
  const existingUsers = await knex('users').whereIn(
    'email',
    sampleUserData.map((d) => d.email)
  );
  const existingParticipants = await knex('participants').where((p) =>
    p.whereLike('name', sampleParticipant.name)
  );

  // Remove seed data from related tables
  await knex('usersToParticipantRoles')
    .whereIn(
      'userId',
      existingUsers.map((user) => user.id)
    )
    .del();
  await knex('usersToParticipantRoles')
    .whereIn(
      'participantId',
      existingParticipants.map((participant) => participant.id)
    )
    .del();
  await knex('auditTrails')
    .whereIn(
      'participantId',
      existingParticipants.map((participant) => participant.id)
    )
    .update('participantId', null);
  await knex('users')
    .whereIn(
      'id',
      existingUsers.map((user) => user.id)
    )
    .del();
  await knex('participants')
    .where((p) => p.whereLike('name', sampleParticipant.name))
    .del();

  // Inserts seed entries
  const participantId = await CreateParticipant(knex, sampleParticipant, 'Advertiser', [
    'MAPPER',
    'SHARER',
  ]);
  await knex('users').insert(sampleUserData);

  // Insert user <-> participant mapping
  const newUsers = await knex('users').whereIn(
    'email',
    sampleUserData.map((d) => d.email)
  );
  await knex('usersToParticipantRoles').insert(
    newUsers.map((user: UserType) => ({
      userId: user.id,
      participantId,
      userRoleId: UserRoleId.UID2Support,
    }))
  );
}
