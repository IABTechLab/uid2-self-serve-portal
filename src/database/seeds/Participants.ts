import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { Participant, ParticipantStatus } from '../../api/entities/Participant';

type ParticipantsType = ModelObject<Participant>;
const sampleData: Optional<
  ParticipantsType & { type: string; apiRolesString: string[] },
  'id' | 'location' | 'siteId' | 'types' | 'users' | 'apiRoles'
>[] = [
  {
    name: 'Publisher example',
    allowSharing: true,
    status: ParticipantStatus.Approved,
    type: 'Publisher',
    location: 'Sydney',
    siteId: 124,
    apiRolesString: ['GENERATOR', 'SHARER'],
    completedRecommendations: false,
  },
  {
    name: 'DSP example',
    status: ParticipantStatus.Approved,
    type: 'DSP',
    allowSharing: true,
    location: 'Sydney',
    siteId: 123,
    apiRolesString: ['ID_READER', 'SHARER'],
    completedRecommendations: false,
  },
  {
    name: 'DP example',
    status: ParticipantStatus.Approved,
    allowSharing: true,
    type: 'Data Provider',
    location: 'Sydney',
    siteId: 125,
    apiRolesString: ['MAPPER', 'SHARER'],
    completedRecommendations: false,
  },
  {
    name: 'Advertiser example',
    allowSharing: true,
    status: ParticipantStatus.Approved,
    type: 'Advertiser',
    location: 'Sydney',
    siteId: 126,
    apiRolesString: ['MAPPER', 'SHARER'],
    completedRecommendations: false,
  },
  {
    name: 'AwaitingSigning example',
    allowSharing: true,
    status: ParticipantStatus.AwaitingSigning,
    type: 'Publisher',
    location: 'Sydney',
    apiRolesString: ['GENERATOR', 'SHARER'],
    completedRecommendations: false,
  },
];

export async function CreateParticipant(
  knex: Knex,
  details: Optional<
    ParticipantsType,
    'id' | 'allowSharing' | 'location' | 'siteId' | 'types' | 'users' | 'apiRoles'
  >,
  type: string,
  apiRolesString: string[]
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

  await apiRolesString.forEach(async (role) => {
    const apiRole = await knex('apiRoles').where('roleName', role);
    await knex('participantsToApiRoles').insert<{
      participantId: number;
      apiRoleId: number;
    }>({
      participantId: participant[0].id as number,
      apiRoleId: apiRole[0].id as number,
    });
  });

  return parseInt(participant[0].id as string, 10);
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('participants').whereILike('name', '%example').del();
  // Inserts seed entries
  const promises = sampleData.map((sample) =>
    CreateParticipant(knex, sample, sample.type, sample.apiRolesString)
  );
  await Promise.all(promises);
}
