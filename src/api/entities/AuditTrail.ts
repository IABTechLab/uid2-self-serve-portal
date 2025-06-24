import { Model, RelationMappings } from 'objection';

import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';
import { User } from './User';

export enum AuditAction {
  Add = 'Add',
  Delete = 'Delete',
  Update = 'Update',
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
  ChangeUserLock = 'ChangeUserLock',
}

export class AuditTrail extends BaseModel {
  static get tableName() {
    return 'auditTrails';
  }

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => User,
        join: {
          from: 'auditTrails.userId',
          to: 'users.id',
        },
      },
    };
  }

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
  // eslint-disable-next-line camelcase
  declare updated_at: Date;
}

export type AuditTrailDTO = ModelObjectOpt<AuditTrail>;
