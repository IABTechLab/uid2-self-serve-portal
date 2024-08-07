import { z } from 'zod';

import { ParticipantSchema } from '../../entities/Participant';
import { ParticipantTypeSchema } from '../../entities/ParticipantType';
import { UserCreationPartial } from '../../entities/User';
import { UserToParticipantRoleCreationPartial, UserToParticipantRoleSchema } from '../../entities/UserToParticipantRole';

export const ParticipantCreationRequest = z.object({
  participantName: z.string(),
  participantTypes: z.array(z.number()),
  apiRoles: z.array(z.number()),
  siteId: z.number().optional(),
  siteName: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  jobFunction: z.string().optional(),
  crmAgreementNumber: z.string(),
});

// TODO remove unused comments
export const ParticipantCreationAndApprovalPartial = ParticipantSchema.pick({
  siteId: true,
  name: true,
  types: true,
  apiRoles: true,
  crmAgreementNumber: true,
  // status: true,
  // approverId: true,
  // dateApproved: true,
}).extend({
  siteId: z.number().optional(),
  types: z.array(ParticipantTypeSchema.pick({ id: true })),
  apiRoles: z.array(ParticipantTypeSchema.pick({ id: true })),
  // users: z.array(UserCreationPartial),
  // userRoleId: z.array(z.number()),
  // participantToUserRoles: z.array(z.number()),
  // participantToUserRoles: z.array(UserToParticipantRoleCreationPartial),
  // crmAgreementNumber: z.string(),
});
