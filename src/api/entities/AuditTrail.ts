import { Model } from 'objection';

import { ClientType } from '../services/adminServiceHelpers';
import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

export enum SharingAction {
  Add = 'add',
  Delete = 'delete',
}

export enum AuditTrailEvents {
  UpdateSharingPermissions = 'UpdateSharingPermissions',
  UpdateSharingTypes = 'UpdateSharingTypes',
  ApproveAccount = 'ApproveAccount',
}

export type AuditTrailEventData =
  | UpdateSharingPermissionEventData
  | ApproveAccountEventData
  | UpdateSharingTypesEventData;

export type UpdateSharingPermissionEventData = {
  siteId: number;
  action: SharingAction;
  sharingPermissions: number[];
};

export type UpdateSharingTypesEventData = {
  siteId: number;
  allowedTypes: ClientType[];
};

export type ApproveAccountEventData = {
  siteId: number;
  oldName?: string;
  newName?: string;
  oldTypeIds?: number[];
  newTypeIds?: number[];
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

  static get jsonAttributes() {
    return ['eventData'];
  }

  id!: number;
  userId!: number;
  participantId!: number;
  userEmail!: string;
  succeeded!: boolean;
  event!: AuditTrailEvents;
  eventData!: AuditTrailEventData;
}

export type AuditTrailDTO = ModelObjectOpt<AuditTrail>;
