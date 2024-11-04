// import { Knex } from 'knex';
// import { ModelObject } from 'objection';
// import { Optional } from 'utility-types';

// import { Approver } from '../../api/entities/Approver';

// type ApproverType = ModelObject<Approver>;
// const sampleData: Optional<ApproverType & { type: string }, 'id' | 'participantTypeId'>[] = [
//   {
//     email: 'dsp_approver@example.com',
//     displayName: 'DSP Approver',
//     type: 'DSP',
//   },
//   {
//     email: 'advertiser_approver@example.com',
//     displayName: 'Advertiser Approver',
//     type: 'Advertiser',
//   },
//   {
//     email: 'publisher_approver@example.com',
//     displayName: 'Publisher Approver',
//     type: 'Publisher',
//   },
//   {
//     email: 'dp_approver@example.com',
//     displayName: 'Data Provider Approver',
//     type: 'Data Provider',
//   },
//   {
//     email: 'test@example.com',
//     displayName: 'Test Admin',
//     type: 'DSP',
//   },
//   {
//     email: 'test@example.com',
//     displayName: 'Test Admin',
//     type: 'Advertiser',
//   },
//   {
//     email: 'test@example.com',
//     displayName: 'Test Admin',
//     type: 'Publisher',
//   },
//   {
//     email: 'test@example.com',
//     displayName: 'Test Admin',
//     type: 'Data Provider',
//   },
// ];

// export async function CreateApprover(
//   knex: Knex,
//   details: Optional<ApproverType & { type: string }, 'id' | 'participantTypeId'>
// ) {
//   const participantType = await knex('participantTypes').where('typeName', details.type);
//   return knex('approvers').insert<{
//     email: number;
//     participantTypeId: number;
//     displayName: string;
//   }>({
//     email: details.email,
//     participantTypeId: participantType[0].id as number,
//     displayName: details.displayName,
//   });
// }

// export async function seed(knex: Knex): Promise<void> {
//   // Deletes ALL existing entries
//   await knex('approvers')
//     .whereIn(
//       'email',
//       sampleData.map((d) => d.email)
//     )
//     .del();
//   // Inserts seed entries
//   const promises = sampleData.map((sample) => CreateApprover(knex, sample));
//   await Promise.all(promises);
// }
