import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { ParticipantStatus } from '../../api/entities/Participant';
import { User, UserJobFunction } from '../../api/entities/User';
import { CreateParticipant } from './Participants';

type UserType = ModelObject<User>;

const sampleParticipant = {
  name: 'Awaiting Approval',
  status: ParticipantStatus.AwaitingApproval,
  allowSharing: true,
  completedRecommendations: false,
  crmAgreementNumber: '12345678',
};
const sampleData: Optional<UserType, 'id'>[] = [
  {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    phone: '+61298765432',
    jobFunction: UserJobFunction.DA,
    acceptedTerms: false,
  },
];

export async function seed(knex: Knex): Promise<void> {
  const existingUsers = await knex('users').whereIn(
    'email',
    sampleData.map((d) => d.email)
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
  await knex('users').insert(sampleData);

  // Insert user <-> participant mapping
  const newUsers = await knex('users').whereIn(
    'email',
    sampleData.map((d) => d.email)
  );
  await knex('usersToParticipantRoles').insert(
    newUsers.map((user: UserType) => ({ userId: user.id, participantId }))
  );
}
