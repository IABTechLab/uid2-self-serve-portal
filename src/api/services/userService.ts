import { injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../entities/AuditTrail';
import { ParticipantType } from '../entities/ParticipantType';
import { UserJobFunction } from '../entities/User';
import { getTraceId } from '../helpers/loggingHelpers';
import { mapClientTypeToParticipantType } from '../helpers/siteConvertingHelpers';
import { getKcAdminClient } from '../keycloakAdminClient';
import { getSite } from './adminServiceClient';
import { getApiRoles } from './apiKeyService';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from './auditTrailService';
import { deleteUserByEmail, updateUserProfile } from './kcUsersService';
import { UserParticipantRequest } from './participantsService';
import { enrichUserWithIsApprover, findUserByEmail, UserRequest } from './usersService';

export type DeletedUser = {
  email: string;
  participantId: number | null;
  deleted: boolean;
};

export const UpdateUserParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  jobFunction: z.nativeEnum(UserJobFunction),
});

export const SelfResendInvitationParser = z.object({ email: z.string() });

@injectable()
export class UserService {
  public async getCurrentUser(req: UserRequest) {
    const userEmail = req.auth?.payload?.email as string;
    const user = await findUserByEmail(userEmail);
    const userWithIsApprover = await enrichUserWithIsApprover(user!);
    return userWithIsApprover;
  }

  public async getDefaultParticipant(req: UserRequest) {
    const currentParticipant = req.user?.participants?.[0];
    const currentSite = !currentParticipant?.siteId
      ? undefined
      : await getSite(currentParticipant?.siteId);
    const apiRoles = await getApiRoles(currentParticipant!);
    const allParticipantTypes = await ParticipantType.query();
    const result = {
      ...currentParticipant,
      types: mapClientTypeToParticipantType(currentSite?.clientTypes || [], allParticipantTypes),
      apiRoles,
    };
    return result;
  }

  // TODO: Allow for a participant to be specified, so they aren't removed from all of their participants in UID2-3852
  public async deleteUser(req: UserParticipantRequest) {
    const { user, participant } = req;
    const requestingUser = await findUserByEmail(req.auth?.payload.email as string);
    const traceId = getTraceId(req);

    const data: DeletedUser = {
      email: `${user?.email}-removed-${uuid()}`,
      // TODO: Remove participantId in UID2-3821
      participantId: null,
      deleted: true,
    };

    const auditTrailInsertObject = constructAuditTrailObject(
      requestingUser!,
      AuditTrailEvents.ManageTeamMembers,
      {
        action: AuditAction.Delete,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        jobFunction: user?.jobFunction,
      },
      participant!.id
    );

    await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
      const kcAdminClient = await getKcAdminClient();
      await Promise.all([
        deleteUserByEmail(kcAdminClient, user?.email!),
        user!.$query().patch(data),
      ]);
    });
  }

  public async updateUser(req: UserParticipantRequest) {
    const { user, participant } = req;
    const requestingUser = await findUserByEmail(req.auth?.payload.email as string);
    const data = UpdateUserParser.parse(req.body);
    const traceId = getTraceId(req);

    const auditTrailInsertObject = constructAuditTrailObject(
      requestingUser!,
      AuditTrailEvents.ManageTeamMembers,
      {
        action: AuditAction.Update,
        email: user!.email, // So we know which user is being updated, in case their name changes
        firstName: data.firstName,
        lastName: data.lastName,
        jobFunction: data.jobFunction,
      },
      participant!.id
    );

    await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
      const kcAdminClient = await getKcAdminClient();
      await Promise.all([
        updateUserProfile(kcAdminClient, user?.email!, {
          firstName: data.firstName,
          lastName: data.lastName,
        }),
        user!.$query().patch(data),
      ]);
    });
  }
}
