import { Model } from 'objection';

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
  ManageParticipant = 'ManageParticipant',
  UpdateDomainNames = 'UpdateDomainNames',
  UpdateAppNames = 'UpdateAppNames',
  ManageTeamMembers = 'ManageTeamMembers',
}

export class AuditTrail extends BaseModel {
  static get tableName() {
    return 'auditTrails';
  }
  static readonly relationMappings = {
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
  declare eventData: unknown;
  declare participantId?: number | null;
}

export type AuditTrailDTO = ModelObjectOpt<AuditTrail>;
