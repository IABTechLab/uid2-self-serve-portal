import { z } from 'zod';

import { ParticipantTypeSchema } from '../../entities/ParticipantType';
import { ParticipantSchema } from '../../entities/Schemas';

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

export const ParticipantCreationAndApprovalPartial = ParticipantSchema.pick({
  siteId: true,
  name: true,
  types: true,
  apiRoles: true,
  crmAgreementNumber: true,
}).extend({
  siteId: z.number().optional(),
  types: z.array(ParticipantTypeSchema.pick({ id: true })),
  apiRoles: z.array(ParticipantTypeSchema.pick({ id: true })),
});
