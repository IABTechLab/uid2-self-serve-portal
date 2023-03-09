import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { Participant } from '../../api/entities/Participant';

type ParitcipantsType = ModelObject<Participant> & { type: string };
const sampleData: Optional<ParitcipantsType, 'id'>[] = [
  { name: 'Publisher example', location: '', status: 'awaiting_approval', type: 'Publisher' },
  { name: 'DSP example', location: '', status: 'initialize', type: 'DSP' },
  { name: 'DP example', location: '', status: 'approved', type: 'Data Provider' },
  { name: 'Advertiser example', location: '', status: 'approved', type: 'Advertiser' },
];

const createParticipant = async (knex: Knex, sample: Optional<ParitcipantsType, 'id'>) => {
  const participant = await knex('participants')
    .insert({
      name: sample.name,
      location: sample.location,
      status: sample.status,
    })
    .returning('id');
  const participantType = await knex('participants_types').where('typeName', sample.type);
  await knex('participants_X_types').insert<{
    participantId: number;
    participantsTypeId: number;
  }>({
    participantId: participant[0].id as number,
    participantsTypeId: participantType[0].id as number,
  });
};

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('participants').whereILike('name', '%example').del();
  // Inserts seed entries
  const promises = sampleData.map((sample) => createParticipant(knex, sample));
  await Promise.all(promises);
}
