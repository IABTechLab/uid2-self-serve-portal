import { Model, RelationMappings } from 'objection';

import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

export class ApiRole extends BaseModel {
  static get tableName() {
    return 'apiRoles';
  }

  static get relationMappings(): RelationMappings {
    return {
      participants: {
        relation: Model.ManyToManyRelation,
        modelClass: () => import('./Participant').then(m => m.Participant) as unknown as typeof Model,
        join: {
          from: 'apiRoles.id',
          through: {
            from: 'participantsToApiRoles.apiRoleId',
            to: 'participantsToApiRoles.participantId',
          },
          to: 'participants.id',
        },
      },
    };
  }

  declare id: number;
  declare roleName: string;
  declare externalName: string;
  declare disabled: boolean;
  declare order: number;
}

export type ApiRoleDTO = Omit<ModelObjectOpt<ApiRole>, 'disabled'>;
