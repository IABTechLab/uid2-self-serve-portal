import { z } from 'zod';

import { ContactType } from './EmailContact.ts';
import { UserJobFunction } from './User.ts';

export const ApiRoleSchema = z.object({
  id: z.number(),
  roleName: z.string(),
  externalName: z.string(),
  order: z.number(),
});

export const EmailContactSchema = z.object({
  id: z.number(),
  name: z.string(),
  emailAlias: z.string(),
  contactType: z.nativeEnum(ContactType),
  participantId: z.number(),
});
export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  jobFunction: z.nativeEnum(UserJobFunction).optional(),
  acceptedTerms: z.boolean(),
  locked: z.boolean().optional(),
});

export const ParticipantTypeSchema = z.object({
  id: z.number(),
  typeName: z.string().optional(),
});

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

export const UserCreationPartial = UserSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  jobFunction: true,
  acceptedTerms: true,
});
