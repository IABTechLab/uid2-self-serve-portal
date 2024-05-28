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
  declare order: number;
}

export type ApiRoleDTO = Omit<ModelObjectOpt<ApiRole>, 'disabled'>;

export const ApiRoleSchema = z.object({
  id: z.number(),
  roleName: z.string(),
  externalName: z.string(),
  order: z.number(),
});

export const apiRoles: ApiRoleDTO[] = [
  { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
  { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
  { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
  { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
  { id: 5, roleName: 'OPTOUT', externalName: 'Opt-Out', order: 100 },
];
