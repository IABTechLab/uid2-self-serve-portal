import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';
import { Participant } from '../../api/entities/Participant';
import { ParticipantType } from '../../api/entities/ParticipantType';

type ParitcipantsType = ModelObject<Participant> & { type: string };
const sampleData: Optional<ParitcipantsType, 'id'>[] = [
  { name: 'Publisher 1', location: '', status: 'awaiting_approval', type: 'Publisher' },
  { name: 'DSP 1', location: '', status: 'initialize', type: 'DSP' },
  { name: 'DP 1', location: '', status: 'approved', type: 'Data Provider' },
  { name: 'Advertiser', location: '', status: 'approved', type: 'Advertiser' },
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('participants').del();
  await knex.schema.raw(`DBCC CHECKIDENT ('participants', RESEED, 0)`);
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
