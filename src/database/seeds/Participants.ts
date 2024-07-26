import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { Participant, ParticipantStatus } from '../../api/entities/Participant';

type ParticipantsType = ModelObject<Participant>;
const sampleData: Optional<
  ParticipantsType & { type: string; apiRoleNames: string[] },
  'id' | 'siteId' | 'types' | 'users' | 'apiRoles'
>[] = [
  {
    name: 'Publisher example',
    allowSharing: true,
    status: ParticipantStatus.Approved,
    type: 'Publisher',
    siteId: 124,
    apiRoleNames: ['GENERATOR', 'SHARER'],
    completedRecommendations: false,
    crmAgreementNumber: '12345678',
  },
  {
    name: 'DSP example',
    status: ParticipantStatus.Approved,
    type: 'DSP',
    allowSharing: true,
    siteId: 123,
    apiRoleNames: ['ID_READER', 'SHARER'],
    completedRecommendations: false,
    crmAgreementNumber: '23456789',
  },
  {
    name: 'DP example',
    status: ParticipantStatus.Approved,
    allowSharing: true,
    type: 'Data Provider',
    siteId: 125,
    apiRoleNames: ['MAPPER', 'SHARER'],
    completedRecommendations: false,
    crmAgreementNumber: '34567890',
  },
  {
    name: 'Advertiser example',
    allowSharing: true,
    status: ParticipantStatus.Approved,
    type: 'Advertiser',
    siteId: 126,
    apiRoleNames: ['MAPPER', 'SHARER'],
    completedRecommendations: false,
    crmAgreementNumber: '45678901',
  },
  {
    name: 'AwaitingSigning example',
    allowSharing: true,
    status: ParticipantStatus.AwaitingSigning,
    type: 'Publisher',
    apiRoleNames: ['GENERATOR', 'SHARER'],
    completedRecommendations: false,
    crmAgreementNumber: '56789012',
  },
];

export async function CreateParticipant(
  knex: Knex,
  details: Optional<
    ParticipantsType,
    'id' | 'allowSharing' | 'siteId' | 'types' | 'users' | 'apiRoles'
  >,
  type: string,
  apiRoleNames: string[]
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

  apiRoleNames.forEach(async (role) => {
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
  // Deletes existing entries for sampleData

  const sampleParticipantNames = sampleData.map((d) => d.name);
  const sampleParticipantIds = await knex('participants')
    .whereIn('name', sampleParticipantNames)
    .pluck('id');

  await knex('auditTrails')
    .whereIn('participantId', sampleParticipantIds)
    .update('participantId', null);
  await knex('usersToParticipantRoles').whereIn('participantId', sampleParticipantIds).del();
  await knex('users').whereIn('participantId', sampleParticipantIds).del();
  await knex('participants').whereIn('name', sampleParticipantNames).del();

  // Inserts seed entries
  const promises = sampleData.map((sample) =>
    CreateParticipant(knex, sample, sample.type, sample.apiRoleNames)
  );
  await Promise.all(promises);
}
