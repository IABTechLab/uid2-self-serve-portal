import { Response } from 'express';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import { UserJobFunction } from '../../entities/User';
import { getTraceId } from '../../helpers/loggingHelpers';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import { ParticipantRequest, UserParticipantRequest } from '../../services/participantsService';
import { getAllUserFromParticipant, inviteUserToParticipant } from '../../services/usersService';

export async function getParticipantUsers(req: ParticipantRequest, res: Response) {
  const { participant } = req;
  const users = await getAllUserFromParticipant(participant!);
  return res.status(200).json(users);
}

export const UserInvitationParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  jobFunction: z.nativeEnum(UserJobFunction),
});

export async function handleInviteUserToParticipant(req: UserParticipantRequest, res: Response) {
  try {
    const { participant, user } = req;
    const userPartial = UserInvitationParser.parse(req.body);
    const traceId = getTraceId(req);
    const auditTrailInsertObject = constructAuditTrailObject(
      user!,
      AuditTrailEvents.ManageTeamMembers,
      {
        action: AuditAction.Add,
        firstName: userPartial.firstName,
        lastName: userPartial.lastName,
        email: userPartial.email,
        jonFunction: userPartial.jobFunction,
      }
    );

    await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
      await inviteUserToParticipant(userPartial, participant!, traceId);
    });

    return res.sendStatus(201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(err.issues);
    }
    throw err;
  }
}
