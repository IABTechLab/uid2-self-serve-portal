import { Model, RelationMappings } from 'objection';

import { ApiRole, ApiRoleDTO } from './ApiRole';
import { BaseModel } from './BaseModel';
import { BusinessContact } from './BusinessContact';
import { ModelObjectOpt } from './ModelObjectOpt';
import { ParticipantType, ParticipantTypeDTO } from './ParticipantType';
import { User, UserDTO } from './User';
import { UserToParticipantRole } from './UserToParticipantRole';

export class Participant extends BaseModel {
  static get tableName() {
    return 'participants';
  }

	static get relationMappings(): RelationMappings {
    return {
      types: {
        relation: Model.ManyToManyRelation,
        modelClass: ParticipantType,
        join: {
          from: 'participants.id',
          through: {
            from: 'participantsToTypes.participantId',
            to: 'participantsToTypes.participantTypeId',
          },
          to: 'participantTypes.id',
        },
      },
      apiRoles: {
        relation: Model.ManyToManyRelation,
        modelClass: ApiRole,
        join: {
          from: 'participants.id',
          through: {
            from: 'participantsToApiRoles.participantId',
            to: 'participantsToApiRoles.apiRoleId',
          },
          to: 'apiRoles.id',
        },
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'participants.id',
          through: {
            from: 'usersToParticipantRoles.participantId',
            to: 'usersToParticipantRoles.userId',
          },
          to: 'users.id',
        },
      },
			businessContacts: {
				relation: Model.HasManyRelation,
				modelClass: BusinessContact,
				join: {
					from: 'participants.id',
					to: 'businessContacts.participantId',
				},
			},
      approver: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'participants.approverId',
          to: 'users.id',
        },
      },
      participantToUserRoles: {
        relation: Model.HasManyRelation,
        modelClass: UserToParticipantRole,
        join: {
          from: 'participants.id',
          to: 'usersToParticipantRoles.participantId',
        },
      },
    };
  }

  // Declare instance properties with types
  id!: number;
  name!: string;
  allowSharing!: boolean;
  completedRecommendations!: boolean;
  siteId?: number;
  types?: ParticipantType[];
  apiRoles?: ApiRole[];
  users?: User[];
  approverId?: number;
  approver?: UserDTO;
  dateApproved?: Date;
  crmAgreementNumber!: string | null;
  currentUserRoleIds?: number[];
  participantToUserRoles?: UserToParticipantRole[];
}

// TODO: Can ModelObjectOpt do relationships automatically?
export type ParticipantDTO = Omit<ModelObjectOpt<Participant>, 'types' | 'users' | 'apiRoles'> & {
  types?: ParticipantTypeDTO[];
  apiRoles?: ApiRoleDTO[];
  users?: ModelObjectOpt<User>[];
};


