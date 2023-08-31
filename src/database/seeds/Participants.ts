import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { Participant, ParticipantStatus } from '../../api/entities/Participant';

type ParticipantsType = ModelObject<Participant>;
const sampleData: Optional<
  ParticipantsType & { type: string },
  'id' | 'location' | 'siteId' | 'types' | 'users'
>[] = [
  {
    name: 'Publisher example',
    allowSharing: true,
    status: ParticipantStatus.Approved,
    type: 'Publisher',
    location: 'Sydney',
    siteId: 124,
  },
  {
    name: 'DSP example',
    status: ParticipantStatus.Approved,
    type: 'DSP',
    allowSharing: true,
    location: 'Sydney',
    siteId: 123,
  },
  {
    name: 'DP example',
    status: ParticipantStatus.Approved,
    allowSharing: true,
    type: 'Data Provider',
    location: 'Sydney',
    siteId: 125,
  },
  {
    name: 'Advertiser example',
    allowSharing: true,
    status: ParticipantStatus.Approved,
    type: 'Advertiser',
    location: 'Sydney',
    siteId: 126,
  },
  {
    name: 'AwaitingSigning example',
    allowSharing: true,
    status: ParticipantStatus.AwaitingSigning,
    type: 'Publisher',
    location: 'Sydney',
  },
];

export async function CreateParticipant(
  knex: Knex,
  details: Optional<
    ParticipantsType,
    'id' | 'allowSharing' | 'location' | 'siteId' | 'types' | 'users'
  >,
  type: string
) {
  const participant = await knex('participants')
    .insert({
      name: details.name,
      status: details.status,
      siteId: details.siteId,
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
