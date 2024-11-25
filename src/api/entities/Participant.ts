import { Model } from 'objection';
import { z } from 'zod';

import { ApiRole, ApiRoleDTO, ApiRoleSchema } from './ApiRole';
import { BaseModel } from './BaseModel';
import { ModelObjectOpt } from './ModelObjectOpt';
import { ParticipantType, ParticipantTypeDTO, ParticipantTypeSchema } from './ParticipantType';
import { type User, UserCreationPartial, UserDTO, UserSchema } from './User';
import { UserToParticipantRole } from './UserToParticipantRole';

export enum ParticipantStatus {
  AwaitingSigning = 'awaitingSigning',
  AwaitingApproval = 'awaitingApproval',
  Approved = 'approved',
}

export class Participant extends BaseModel {
  static get tableName() {
    return 'participants';
  }
  static readonly relationMappings = {
    types: {
      relation: Model.ManyToManyRelation,
      modelClass: 'ParticipantType',
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
      modelClass: 'ApiRole',
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
      modelClass: 'User',
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
      modelClass: 'BusinessContact',
      join: {
        from: 'participants.id',
        to: 'businessContacts.participantId',
      },
    },
    approver: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'participants.approverId',
        to: 'users.id',
      },
    },
    participantToUserRoles: {
      relation: Model.HasManyRelation,
      modelClass: 'UserToParticipantRole',
      join: {
        from: 'participants.id',
        to: 'usersToParticipantRoles.participantId',
      },
    },
  };
  declare id: number;
  declare name: string;
  declare status: ParticipantStatus;
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
}

// TODO: Can ModelObjectOpt do relationships automatically?
export type ParticipantDTO = Omit<ModelObjectOpt<Participant>, 'types' | 'users' | 'apiRoles'> & {
  types?: ParticipantTypeDTO[];
  apiRoles?: ApiRoleDTO[];
  users?: ModelObjectOpt<User>[];
};

export const ParticipantSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.nativeEnum(ParticipantStatus),
  types: z.array(ParticipantTypeSchema).optional(),
  apiRoles: z.array(ApiRoleSchema).optional(),
  users: z.array(UserSchema).optional(),
  allowSharing: z.boolean(),
  siteId: z.number().optional(),
  approverId: z.number().optional(),
  approver: z.array(UserSchema).optional(),
  dateApproved: z.date().optional(),
  crmAgreementNumber: z.string().nullable(),
});

export const ParticipantApprovalPartial = ParticipantSchema.pick({
  siteId: true,
  name: true,
  types: true,
  apiRoles: true,
}).extend({
  types: z.array(ParticipantTypeSchema.pick({ id: true })),
  apiRoles: z.array(ParticipantTypeSchema.pick({ id: true })),
});
