import { Model } from 'objection';

import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

export enum SharingAction {
  Add = 'add',
  Delete = 'delete',
}

export enum KeyPairAction {
  Add = 'add',
  Delete = 'delete',
  Update = 'update',
}

export enum AuditTrailEvents {
  UpdateSharingPermissions = 'UpdateSharingPermissions',
  ApproveAccount = 'ApproveAccount',
  ManageKeyPair = 'ManageKeyPair',
}

export type AuditTrailEventData =
  | UpdateSharingPermissionEventData
  | ApproveAccountEventData
  | ManageKeyPairEventData;

export type UpdateSharingPermissionEventData = {
  siteId: number;
  action: SharingAction;
  sharingPermissions: number[];
};

export type ApproveAccountEventData = {
  siteId: number;
  oldName?: string;
  newName?: string;
  oldTypeIds?: number[];
  newTypeIds?: number[];
};

export type ManageKeyPairEventData = {
  siteId: number;
  name: string;
  disabled: boolean;
  action: KeyPairAction;
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
