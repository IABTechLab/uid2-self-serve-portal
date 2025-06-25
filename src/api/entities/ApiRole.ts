import { Model, RelationMappings } from 'objection';

import { BaseModel } from './BaseModel.ts';
import { ModelObjectOpt } from './ModelObjectOpt.ts';
import { Participant } from './Participant.ts'; // eslint-disable-line import/no-cycle

export class ApiRole extends BaseModel {
  static get tableName() {
    return 'apiRoles';
  }

  static get relationMappings(): RelationMappings {
		return {
			participants: {
				relation: Model.ManyToManyRelation,
				modelClass: () => Participant,
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
  };
  declare id: number;
  declare roleName: string;
  declare externalName: string;
  declare disabled: boolean;
  declare order: number;
}

export type ApiRoleDTO = Omit<ModelObjectOpt<ApiRole>, 'disabled'>;
