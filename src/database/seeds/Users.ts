import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { ParticipantStatus } from '../../api/entities/Participant';
import { User, UserRole } from '../../api/entities/User';
import { CreateParticipant } from './Participants';

type UserType = ModelObject<User>;

const sampleParticipant = {
  name: 'Awaiting Approval',
  status: ParticipantStatus.AwaitingApproval,
  allowSharing: true,
  location: 'Sydney',
};
const sampleData: Optional<UserType, 'id' | 'participantId'>[] = [
  {
    email: 'test@example.com',
    firstName: 'Text',
    lastName: 'User',
    location: 'Sydney, AU',
    phone: '+61298765432',
    role: UserRole.DA,
    acceptedTerms: false,
  },
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users')
    .whereIn(
      'email',
      sampleData.map((d) => d.email)
    )
    .del();
  await knex('participants')
    .where((p) => p.whereLike('name', sampleParticipant.name))
    .del();

  // Inserts seed entries
  const participantId = await CreateParticipant(knex, sampleParticipant, 'Advertiser');
  await knex('users').insert(sampleData.map((user) => ({ ...user, participantId })));
}
