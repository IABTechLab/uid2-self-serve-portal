import { Model, RelationMappings } from 'objection';

import { ApiRole, ApiRoleDTO } from './ApiRole.ts';
import { BaseModel } from './BaseModel.ts';
import { BusinessContact } from './BusinessContact.ts';
import { ModelObjectOpt } from './ModelObjectOpt.ts';
import { ParticipantType, ParticipantTypeDTO } from './ParticipantType.ts';
import { User, UserDTO } from './User.ts';
import { UserToParticipantRole } from './UserToParticipantRole.ts';

export class Participant extends BaseModel {
  static get tableName() {
    return 'participants';
  }
  static get relationMappings(): RelationMappings {
    return {
      types: {
        relation: Model.ManyToManyRelation,
        modelClass: () => ParticipantType,
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
        modelClass: () => ApiRole,
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
        modelClass: () => User,
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
        modelClass: () => BusinessContact,
        join: {
          from: 'participants.id',
          to: 'businessContacts.participantId',
        },
      },
      approver: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => User,
        join: {
          from: 'participants.approverId',
          to: 'users.id',
        },
      },
      participantToUserRoles: {
        relation: Model.HasManyRelation,
        modelClass: () => UserToParticipantRole,
        join: {
          from: 'participants.id',
          to: 'usersToParticipantRoles.participantId',
        },
      },
      primaryContact: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => User,
        join: {
          from: 'participants.id',
          through: {
            from: 'primaryContacts.participantId',
            to: 'primaryContacts.userId',
          },
          to: 'users.id',
        },
      },
    };
  }
  declare id: number;
  declare name: string;
  declare allowSharing: boolean;
  declare completedRecommendations: boolean;
  declare siteId?: number;
  declare types?: ParticipantType[];
  declare apiRoles?: ApiRole[];
  declare users?: User[];
  declare approverId?: number;
  declare approver?: UserDTO;
  declare dateApproved?: Date;
  declare crmAgreementNumber: string | null;
  declare currentUserRoleIds?: number[];
  declare participantToUserRoles?: UserToParticipantRole[];
  declare primaryContact?: User;
}

// TODO: Can ModelObjectOpt do relationships automatically?
export type ParticipantDTO = Omit<
  ModelObjectOpt<Participant>,
  'types' | 'users' | 'apiRoles' | 'primaryContact'
> & {
  types?: ParticipantTypeDTO[];
  apiRoles?: ApiRoleDTO[];
  users?: ModelObjectOpt<User>[];
  primaryContact?: ModelObjectOpt<User>;
};
