import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { Participant, ParticipantStatus } from '../../api/entities/Participant';

type ParticipantsType = ModelObject<Participant>;
const sampleData: Optional<ParticipantsType & { type: string }, 'id'>[] = [
  {
    name: 'Publisher example',

    status: ParticipantStatus.AwaitingSigning,
    type: 'Publisher',
  },
  { name: 'DSP example', status: ParticipantStatus.AwaitingApproval, type: 'DSP' },
  { name: 'DP example', status: ParticipantStatus.Approved, type: 'Data Provider' },
  {
    name: 'Advertiser example',

    status: ParticipantStatus.Approved,
    type: 'Advertiser',
  },
];

export async function CreateParticipant(
  knex: Knex,
  details: Optional<ParticipantsType, 'id'>,
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
