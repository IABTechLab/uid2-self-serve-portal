import { Response } from 'express';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import { UserJobFunction } from '../../entities/User';
import { getUserRoleById } from '../../entities/UserRole';
import { getTraceId } from '../../helpers/loggingHelpers';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import { ParticipantRequest, UserParticipantRequest } from '../../services/participantsService';
import { UpdateUserRoleIdSchema } from '../../services/userService';
import {
  getAllUsersFromParticipantWithRoles,
  inviteUserToParticipant,
} from '../../services/usersService';

export async function handleGetParticipantUsers(req: ParticipantRequest, res: Response) {
  const { participant } = req;
  const users = await getAllUsersFromParticipantWithRoles(participant!);
  return res.status(200).json(users);
}

const userInvitationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  jobFunction: z.nativeEnum(UserJobFunction),
});
export async function handleInviteUserToParticipant(req: UserParticipantRequest, res: Response) {
  try {
    const { participant, user } = req;
    const userPartial = userInvitationSchema.parse(req.body);
    const userRoleIdData = UpdateUserRoleIdSchema.parse(req.body);
    const traceId = getTraceId(req);
    const auditTrailInsertObject = constructAuditTrailObject(
      user!,
      AuditTrailEvents.ManageTeamMembers,
      {
        action: AuditAction.Add,
        firstName: userPartial.firstName,
        lastName: userPartial.lastName,
        email: userPartial.email,
        jobFunction: userPartial.jobFunction,
        userRoleId: getUserRoleById(userRoleIdData.userRoleId),
      },
      participant!.id
    );

    let createdUser;

    await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
      createdUser = await inviteUserToParticipant(
        userPartial,
        participant!,
        userRoleIdData.userRoleId,
        traceId
      );
    });

    return res.status(201).json({ user: createdUser });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(err.issues);
    }
    throw err;
  }
}
