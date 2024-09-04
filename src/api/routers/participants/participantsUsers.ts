import { Response } from 'express';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import { UserJobFunction } from '../../entities/User';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getKcAdminClient } from '../../keycloakAdminClient';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import { createNewUser, sendInviteEmailToNewUser } from '../../services/kcUsersService';
import { ParticipantRequest, UserParticipantRequest } from '../../services/participantsService';
import {
  createUserInPortal,
  findUserByEmail,
  getAllUserFromParticipant,
} from '../../services/usersService';

export async function getParticipantUsers(req: ParticipantRequest, res: Response) {
  const { participant } = req;
  const users = await getAllUserFromParticipant(participant!);
  return res.status(200).json(users);
}

const invitationParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  jobFunction: z.nativeEnum(UserJobFunction),
});

export async function handleInviteUserToParticipant(req: UserParticipantRequest, res: Response) {
  try {
    const { participant, user } = req;
    const { firstName, lastName, email, jobFunction } = invitationParser.parse(req.body);
    const traceId = getTraceId(req);
    // TODO: UID2-3878 - support user belonging to multiple participants by not 400ing here if the user already exists.
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).send('Error inviting user');
    }
    const kcAdminClient = await getKcAdminClient();
    const auditTrailInsertObject = constructAuditTrailObject(
      user!,
      AuditTrailEvents.ManageTeamMembers,
      {
        action: AuditAction.Add,
        firstName,
        lastName,
        email,
        jobFunction,
      },
      participant!.id
    );

    await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
      const newUser = await createNewUser(kcAdminClient, firstName, lastName, email);
      await createUserInPortal(
        {
          email,
          jobFunction,
          firstName,
          lastName,
        },
        participant!.id
      );
      await sendInviteEmailToNewUser(kcAdminClient, newUser);
    });

    return res.sendStatus(201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(err.issues);
    }
    throw err;
  }
}
