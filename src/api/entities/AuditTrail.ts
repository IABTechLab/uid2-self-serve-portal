import { Model } from 'objection';

import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

export enum SharingAction {
  Add = 'add',
  Delete = 'delete',
}

export enum AuditTrailEvents {
  UpdateSharingPermissions = 'UpdateSharingPermissions',
}

export type AuditTrailEventData = UpdateSharingPermissionEventData | string;

export type UpdateSharingPermissionEventData = {
  siteId: number;
  action: SharingAction;
  sharingPermissions: number[];
};

export class AuditTrail extends BaseModel {
  static get tableName() {
    return 'auditTrails';
  }
  static relationMappings = {
    participant: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Participant',
      join: {
        from: 'auditTrails.participantId',
        to: 'participants.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'auditTrails.userId',
        to: 'users.id',
      },
    },
  };

  id!: number;
  userId!: number;
  participantId!: number;
  userEmail!: string;
  proceed!: boolean;
  event!: AuditTrailEvents;
  eventData!: AuditTrailEventData;
}

export type AuditTrailDTO = ModelObjectOpt<AuditTrail>;
