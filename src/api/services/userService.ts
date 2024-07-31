import { injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../entities/AuditTrail';
import { ParticipantType } from '../entities/ParticipantType';
import { UserRole } from '../entities/User';
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
import { enrichUserWithIsApprover, findUserByEmail, UserRequest } from './usersService';

export type DeletedUser = {
  email: string;
  participantId: number | null;
  deleted: boolean;
};

export const UpdateUserParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(UserRole),
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

  public async getCurrentParticipant(req: UserRequest) {
    // TODO: This just gets the user's first participant, but it will need to get the currently selected participant as part of UID2-2822
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
  public async deleteUser(req: UserRequest) {
    const { user } = req;
    const requestingUser = await findUserByEmail(req.auth?.payload.email as string);
    // TODO: This just gets the user's first participant, but it will need to get the currently selected participant as part of UID2-2822
    const currentParticipant = user?.participants?.[0];
    const traceId = getTraceId(req);

    if (requestingUser?.email === user?.email) {
      throw new Error('You do not have permission to delete yourself.');
    }
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
        firstName: user?.firstName,
        lastName: user?.lastName,
        role: user?.role,
      }
    );

    await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
      const kcAdminClient = await getKcAdminClient();
      await Promise.all([
        deleteUserByEmail(kcAdminClient, user?.email!),
        user!.$query().patch(data),
      ]);
    });
  }

  public async updateUser(req: UserRequest) {
    const { user } = req;
    const requestingUser = await findUserByEmail(req.auth?.payload.email as string);
    const data = UpdateUserParser.parse(req.body);
    const traceId = getTraceId(req);

    const auditTrailInsertObject = constructAuditTrailObject(
      requestingUser!,
      AuditTrailEvents.ManageTeamMembers,
      {
        action: AuditAction.Update,
        firstName: user?.firstName,
        lastName: user?.lastName,
        role: user?.role,
      }
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
