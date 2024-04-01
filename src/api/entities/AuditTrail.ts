import { Model } from 'objection';

import { ClientType } from '../services/adminServiceHelpers';
import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

export enum AuditAction {
  Add = 'add',
  Delete = 'delete',
  Update = 'update',
}

export enum AuditTrailEvents {
  UpdateSharingPermissions = 'UpdateSharingPermissions',
  UpdateSharingTypes = 'UpdateSharingTypes',
  ApproveAccount = 'ApproveAccount',
  ManageKeyPair = 'ManageKeyPair',
  ManageApiKey = 'ManageApiKey',
  AddParticipant = 'AddParticipant',
  UpdateDomainNames = 'UpdateDomainNames',
}

export type AuditTrailEventData =
  | UpdateSharingPermissionEventData
  | ApproveAccountEventData
  | UpdateSharingTypesEventData
  | ManageKeyPairEventData
  | ManageApiKeyEventData
  | AddParticipantEventData
  | UpdateDomainNamesEventData;

export type UpdateSharingPermissionEventData = {
  siteId: number;
  action: AuditAction;
  sharingPermissions: number[];
  participantId: number;
};

export type UpdateSharingTypesEventData = {
  siteId: number;
  allowedTypes: ClientType[];
  participantId: number;
};

export type ApproveAccountEventData = {
  siteId: number;
  oldName?: string;
  newName?: string;
  oldTypeIds?: number[];
  newTypeIds?: number[];
  apiRoles?: number[];
  participantId: number;
};

export type AddParticipantEventData = {
  apiRoles: number[];
  email: string;
  firstName: string;
  lastName: string;
  participantName: string;
  participantTypes: number[];
  role: string;
  siteId?: number;
  crmAgreementNumber: string;
};

export type ManageKeyPairEventData = {
  siteId: number;
  name: string;
  disabled: boolean;
  action: AuditAction;
  participantId: number;
};

export type ManageApiKeyEventData = {
  siteId: number;
  action: AuditAction;
  keyName: string;
  apiRoles: string[];
  participantId: number;
  keyId?: string;
  newKeyName?: string;
  newApiRoles?: string[];
};

export type UpdateDomainNamesEventData = {
  siteId: number;
  action: AuditAction;
  participantId: number;
  domainNames: string[];
};

export class AuditTrail extends BaseModel {
  static get tableName() {
    return 'auditTrails';
  }
  static relationMappings = {
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

  declare id: number;
  declare userId: number;
  declare userEmail: string;
  declare succeeded: boolean;
  declare event: AuditTrailEvents;
  declare eventData: AuditTrailEventData;
}

export type AuditTrailDTO = ModelObjectOpt<AuditTrail>;
