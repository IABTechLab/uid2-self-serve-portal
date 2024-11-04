// import { Model } from 'objection';

// import { BaseModel } from './BaseModel';

// export class Approver extends BaseModel {
//   static get tableName() {
//     return 'approvers';
//   }
//   static relationMappings = {
//     type: {
//       relation: Model.BelongsToOneRelation,
//       modelClass: 'ParticipantType',
//       join: {
//         from: 'approvers.participantTypeId',
//         to: 'participantsToTypes.id',
//       },
//     },
//   };
//   declare id: number;
//   declare email: string;
//   declare participantTypeId: number;
//   declare displayName: string;
// }
