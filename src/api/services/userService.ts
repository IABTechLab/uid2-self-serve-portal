import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../entities/AuditTrail';
import { ParticipantType } from '../entities/ParticipantType';
import { UserJobFunction } from '../entities/User';
import { getUserRoleById, UserRoleId } from '../entities/UserRole';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';
import { getTraceId } from '../helpers/loggingHelpers';
import { mapClientTypeToParticipantType } from '../helpers/siteConvertingHelpers';
import { getKcAdminClient } from '../keycloakAdminClient';
import { enrichUserWithSupportRoles } from '../middleware/usersMiddleware';
import { getSite } from './adminServiceClient';
import { getApiRoles } from './apiKeyService';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from './auditTrailService';
import { removeApiParticipantMemberRole, updateUserProfile } from './kcUsersService';
import { getAllParticipants, UserParticipantRequest } from './participantsService';
import { findUserByEmail, UserRequest } from './usersService';

const updateUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  jobFunction: z.nativeEnum(UserJobFunction),
});

export const UpdateUserRoleIdSchema = z.object({
  userRoleId: z.nativeEnum(UserRoleId),
});

export const KeycloakRequestSchema = z.object({ email: z.string() });

export const getCurrentUser = async (req: UserRequest) => {
  const userEmail = req.auth?.payload?.email as string;
  const user = await findUserByEmail(userEmail);
  const userWithSupportRoles = await enrichUserWithSupportRoles(user!);
  if (userWithSupportRoles.isUid2Support) {
    const allParticipants = await getAllParticipants();
    userWithSupportRoles.participants = allParticipants;
  }
  userWithSupportRoles.participants = userWithSupportRoles?.participants?.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return userWithSupportRoles;
};

export const getDefaultParticipant = async (req: UserRequest) => {
  const traceId = getTraceId(req);
  const currentParticipant = req.user?.participants?.[0];
  if (!currentParticipant) return undefined;
  const currentSite = !currentParticipant.siteId
    ? undefined
    : await getSite(currentParticipant.siteId, traceId);
  const apiRoles = await getApiRoles(currentParticipant);
  const allParticipantTypes = await ParticipantType.query();
  const result = {
    ...currentParticipant,
    types: mapClientTypeToParticipantType(currentSite?.clientTypes || [], allParticipantTypes),
    apiRoles,
  };
  return result;
};

export const updateUser = async (req: UserParticipantRequest) => {
  const { user, participant } = req;
  const requestingUser = await findUserByEmail(req.auth?.payload.email as string);
  const userData = updateUserSchema.parse(req.body);
  const userRoleData = UpdateUserRoleIdSchema.parse(req.body);
  const traceId = getTraceId(req);

  const auditTrailInsertObject = constructAuditTrailObject(
    requestingUser!,
    AuditTrailEvents.ManageTeamMembers,
    {
      action: AuditAction.Update,
      email: user!.email, // So we know which user is being updated, in case their name changes
      firstName: userData.firstName,
      lastName: userData.lastName,
      jobFunction: userData.jobFunction,
      userRoleId: getUserRoleById(userRoleData.userRoleId),
    },
    participant!.id
  );

  await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
    const kcAdminClient = await getKcAdminClient();

    await UserToParticipantRole.transaction(async (trx) => {
      await UserToParticipantRole.query(trx)
        .where('participantId', participant!.id)
        .where('userId', user!.id)
        .whereNot('userRoleId', UserRoleId.UID2Support)
        .del();

      await Promise.all([
        updateUserProfile(kcAdminClient, user?.email!, {
          firstName: userData.firstName,
          lastName: userData.lastName,
        }),
        user!.$query().patch(userData),
        await UserToParticipantRole.query(trx).insert({
          userId: user!.id,
          participantId: participant?.id!,
          userRoleId: userRoleData.userRoleId,
        }),
      ]);
    });
  });
};

export const removeUser = async (req: UserParticipantRequest) => {
  const { user, participant } = req;
  const requestingUser = await findUserByEmail(req.auth?.payload.email as string);
  const traceId = getTraceId(req);

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
    await UserToParticipantRole.query()
      .where('userId', user!.id)
      .andWhere('participantId', participant!.id)
      .del();

    const participantsOfUser = await UserToParticipantRole.query().where('userId', user!.id);
    if (participantsOfUser.length === 0) {
      const kcAdminClient = await getKcAdminClient();
      await removeApiParticipantMemberRole(kcAdminClient, user!.email);
    }
  });
};
