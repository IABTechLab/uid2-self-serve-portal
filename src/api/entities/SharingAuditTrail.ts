import { Model } from 'objection';

import { BaseModel } from './BaseModel';

export enum SharingAction {
  Add = 'add',
  Delete = 'delete',
}

export class SharingAuditTrail extends BaseModel {
  static get tableName() {
    return 'sharingAuditTrails';
  }
  static relationMappings = {
    participant: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Participant',
      join: {
        from: 'sharingAuditTrails.participantId',
        to: 'participants.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'sharingAuditTrails.userId',
        to: 'users.id',
      },
    },
  };

  id!: number;
  sharingParticipantSiteId!: number;
  action!: SharingAction;
}
