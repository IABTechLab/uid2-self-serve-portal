import { BaseModel } from './BaseModel';
import { Model, RelationMappings } from 'objection';
import { ParticipantType, ParticipantTypeDTO, ParticipantTypeSchema } from './ParticipantType';
import { ApiRole, ApiRoleDTO, ApiRoleSchema } from './ApiRole';
import { User, UserSchema } from './User';
import { UserToParticipantRole } from './UserToParticipantRole';
import { BusinessContact } from './BusinessContact';
import { ModelObjectOpt } from './ModelObjectOpt';
import { z } from 'zod';

export class Participant extends BaseModel {
  static get tableName() {
    return 'participants';
  }

  static get relationMappings(): RelationMappings {
    return {
      types: {
        relation: Model.ManyToManyRelation,
        modelClass: () => ParticipantType, // lazy getter function returns class
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
        modelClass: () => ApiRole, // same pattern here
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
    };
  }

  // Declare instance properties (optional)
  id!: number;
  name!: string;
  allowSharing!: boolean;
  completedRecommendations!: boolean;
  siteId?: number;
  types?: ParticipantType[];
  apiRoles?: ApiRole[];
  users?: User[];
  approverId?: number;
  approver?: User;
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

export const ParticipantSchema = z.object({
  id: z.number(),
  name: z.string(),
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