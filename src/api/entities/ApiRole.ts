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
          from: 'participantsToRoles.apiRoleId',
          to: 'participantsToRoles.participantId',
        },
        to: 'participants.id',
      },
    },
  };
  declare id: number;
  declare roleName: string;
}

export type ApiRoleDTO = ModelObjectOpt<ApiRole>;

export const ApiRoleTypeSchema = z.object({
  id: z.number(),
  roleName: z.string().optional(),
});
