import { Model } from 'objection';
import { z } from 'zod';

import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';

export class ApiRole extends BaseModel {
  static get tableName() {
    return 'apiRoles';
  }
  static relationMappings = {
    participants: {
      relation: Model.ManyToManyRelation,
      modelClass: 'Participant',
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
  declare id: number;
  declare roleName: string;
  declare externalName: string;
  declare disabled: boolean;
}

export type ApiRoleDTO = Omit<ModelObjectOpt<ApiRole>, 'disabled'>;

export const ApiRoleSchema = z.object({
  id: z.number(),
  roleName: z.string(),
  externalName: z.string(),
  disabled: z.boolean(),
});
