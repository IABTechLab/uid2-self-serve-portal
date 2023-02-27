import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { ParticipantType } from '../../api/entities/ParticipantType';

type ParticipantTypeModel = ModelObject<ParticipantType>;

const sampleData: Optional<ParticipantTypeModel, 'id'>[] = [
  { typeName: 'DSP' },
  {
    typeName: 'Advertiser',
  },
  {
    typeName: 'Data Provider',
  },
  {
    typeName: 'Publisher',
  },
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('participants_types').del();

  // Inserts seed entries
  await knex('participants_types').insert(sampleData);
}
