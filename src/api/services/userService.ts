import { injectable } from 'inversify';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../entities/AuditTrail';
import { ParticipantType } from '../entities/ParticipantType';
import { UserJobFunction } from '../entities/User';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';
import { getTraceId } from '../helpers/loggingHelpers';
import { mapClientTypeToParticipantType } from '../helpers/siteConvertingHelpers';
import { getKcAdminClient } from '../keycloakAdminClient';
import { isUid2Support } from '../middleware/usersMiddleware';
import { getSite } from './adminServiceClient';
import { getApiRoles } from './apiKeyService';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from './auditTrailService';
import { removeApiParticipantMemberRole, updateUserProfile } from './kcUsersService';
import { getParticipantsApproved, UserParticipantRequest } from './participantsService';
import { enrichUserWithUid2Support, findUserByEmail, UserRequest } from './usersService';

const updateUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  jobFunction: z.nativeEnum(UserJobFunction),
});

export const SelfResendInvitationSchema = z.object({ email: z.string() });

@injectable()
export class UserService {
  public async getCurrentUser(req: UserRequest) {
    const userEmail = req.auth?.payload?.email as string;
    const user = await findUserByEmail(userEmail);
    const userWithUid2Support = await enrichUserWithUid2Support(user!);
    if (userWithUid2Support) {
      if (await isUid2Support(userEmail)) {
        const allParticipants = await getParticipantsApproved();
        userWithUid2Support.participants = allParticipants;
      }
    }
    userWithUid2Support.participants = userWithUid2Support?.participants?.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return userWithUid2Support;
  }

  public async getDefaultParticipant(req: UserRequest) {
    const currentParticipant = req.user?.participants?.[0];
    if (!currentParticipant) return undefined;
    const currentSite = !currentParticipant.siteId
      ? undefined
      : await getSite(currentParticipant.siteId);
    const apiRoles = await getApiRoles(currentParticipant);
    const allParticipantTypes = await ParticipantType.query();
    const result = {
      ...currentParticipant,
      types: mapClientTypeToParticipantType(currentSite?.clientTypes || [], allParticipantTypes),
      apiRoles,
    };
    return result;
  }

  public async getIsUid2Support(req: UserRequest) {
    const { user } = req;
    if (!user) return undefined;

    return isUid2Support(user.email);
  }

  public async removeUser(req: UserParticipantRequest) {
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
  }

  public async updateUser(req: UserParticipantRequest) {
    const { user, participant } = req;
    const requestingUser = await findUserByEmail(req.auth?.payload.email as string);
    const data = updateUserSchema.parse(req.body);
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
