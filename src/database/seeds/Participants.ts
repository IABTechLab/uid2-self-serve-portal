import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { Optional } from 'utility-types';

import { Participant } from '../../api/entities/Participant';
import { CompleteRecommendations } from '../../web/services/participant';

type ParticipantsType = ModelObject<Participant>;
const sampleData: Optional<
  ParticipantsType & { type: string; apiRoleNames: string[] },
  'id' | 'siteId' | 'types' | 'users' | 'apiRoles'
>[] = [
  {
    name: 'Publisher example',
    allowSharing: true,
    type: 'Publisher',
    siteId: 124,
    apiRoleNames: ['GENERATOR', 'SHARER'],
    completedRecommendations: false,
    crmAgreementNumber: '12345678',
    dateApproved: new Date('2023-08-15 18:48:16.2000000'),
  },
  {
    name: 'DSP example',
    type: 'DSP',
    allowSharing: true,
    siteId: 123,
    apiRoleNames: ['ID_READER', 'SHARER'],
    completedRecommendations: false,
    crmAgreementNumber: '23456789',
    dateApproved: new Date('2023-08-15 18:48:16.2000000'),
  },
  {
    name: 'DP example',
    allowSharing: true,
    type: 'Data Provider',
    siteId: 125,
    apiRoleNames: ['MAPPER', 'SHARER'],
    completedRecommendations: false,
    crmAgreementNumber: '34567890',
    dateApproved: new Date('2023-08-15 18:48:16.2000000'),
  },
  {
    name: 'Advertiser example',
    allowSharing: true,
    type: 'Advertiser',
    siteId: 126,
    apiRoleNames: ['MAPPER', 'SHARER'],
    completedRecommendations: false,
    crmAgreementNumber: '45678901',
    dateApproved: new Date('2023-08-15 18:48:16.2000000'),
  },
  {
    name: 'AwaitingSigning example',
    allowSharing: true,
    type: 'Publisher',
    apiRoleNames: ['GENERATOR', 'SHARER'],
    completedRecommendations: false,
    crmAgreementNumber: '56789012',
    dateApproved: new Date('2023-08-15 18:48:16.2000000'),
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
      siteId: details.siteId,
      dateApproved: details.dateApproved,
      crmAgreementNumber: details.crmAgreementNumber,
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
