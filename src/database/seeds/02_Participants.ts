import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { Participant, ParticipantStatus } from '../../api/entities/Participant';

type ParitcipantsType = ModelObject<Participant> & { type: string };
const sampleData: Optional<ParitcipantsType, 'id'>[] = [
  {
    name: 'Publisher example',
    location: '',
    status: ParticipantStatus.AwaitingSigning,
    type: 'Publisher',
  },
  { name: 'DSP example', location: '', status: ParticipantStatus.AwaitingApproval, type: 'DSP' },
  { name: 'DP example', location: '', status: ParticipantStatus.Approved, type: 'Data Provider' },
  {
    name: 'Advertiser example',
    location: '',
    status: ParticipantStatus.Approved,
    type: 'Advertiser',
  },
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('participants').whereILike('name', '%example').del();
  // Inserts seed entries
  let promises = sampleData.map((sample) => createParticipant(knex, sample));
  await Promise.all(promises);
}

const createParticipant = async (knex: Knex, sampleData: Optional<ParitcipantsType, 'id'>) => {
  const participant = await knex('participants')
    .insert({
      name: sampleData.name,
      location: sampleData.location,
      status: sampleData.status,
    })
    .returning('id');
  const participantType = await knex('participants_types').where('typeName', sampleData.type);
  await knex('participants_X_types').insert({
    participantId: participant[0].id,
    participantsTypeId: participantType[0].id,
  });
};
