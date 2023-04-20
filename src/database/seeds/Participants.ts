import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { Participant, ParticipantStatus } from '../../api/entities/Participant';

type ParticipantsType = ModelObject<Participant>;
const sampleData: Optional<ParticipantsType & { type: string }, 'id' | 'location'>[] = [
  {
    name: 'Publisher example',
    allowSharing: true,
    status: ParticipantStatus.AwaitingSigning,
    type: 'Publisher',
    location: 'Sydney',
  },
  {
    name: 'DSP example',
    status: ParticipantStatus.AwaitingApproval,
    type: 'DSP',
    allowSharing: true,
    location: 'Sydney',
  },
  {
    name: 'DP example',
    status: ParticipantStatus.Approved,
    allowSharing: true,
    type: 'Data Provider',
    location: 'Sydney',
  },
  {
    name: 'Advertiser example',
    allowSharing: true,
    status: ParticipantStatus.Approved,
    type: 'Advertiser',
    location: 'Sydney',
  },
];

export async function CreateParticipant(
  knex: Knex,
  details: Optional<ParticipantsType, 'id' | 'allowSharing' | 'location'>,
  type: string
) {
  const participant = await knex('participants')
    .insert({
      name: details.name,
      status: details.status,
    })
    .returning('id');
  const participantType = await knex('participantTypes').where('typeName', type);
  await knex('participantsToTypes').insert<{
    participantId: number;
    participantTypeId: number;
  }>({
    participantId: participant[0].id as number,
    participantTypeId: participantType[0].id as number,
  });
  return parseInt(participant[0].id as string, 10);
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('participants').whereILike('name', '%example').del();
  // Inserts seed entries
  const promises = sampleData.map((sample) => CreateParticipant(knex, sample, sample.type));
  await Promise.all(promises);
}
