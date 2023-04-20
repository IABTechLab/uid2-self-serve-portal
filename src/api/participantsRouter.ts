import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { Participant, ParticipantSchema } from './entities/Participant';
import { UserRole } from './entities/User';
import { getKcAdminClient } from './keycloakAdminClient';
import { createNewUser, sendInviteEmail } from './services/kcUsersService';
import { createUserInPortal, isUserBelongsToParticipant } from './services/usersService';

export const participantsRouter = express.Router();

const idParser = z.object({
  participantId: z.coerce.number(),
});

export interface ParticipantRequest extends Request {
  participant?: Participant;
}

export const hasParticipantAccess = async (
  req: ParticipantRequest,
  res: Response,
  next: NextFunction
) => {
  const { participantId } = idParser.parse(req.params);
  const participant = await Participant.query().findById(participantId);
  if (!participant) {
    return res.status(404).send([{ message: 'The participant cannot be found.' }]);
  }

  if (!(await isUserBelongsToParticipant(req.auth?.payload?.email as string, participantId))) {
    return res.status(401).send([{ message: 'You do not have permission to update participant.' }]);
  }

  req.participant = participant;
  return next();
};

participantsRouter.get('/', async (_req, res) => {
  const participants = await Participant.query().withGraphFetched('types');
  return res.status(200).json(participants);
});

participantsRouter.post('/', async (req, res) => {
  try {
    const data = ParticipantSchema.parse(req.body);
    // insertGraphAndFetch will implicitly create a transaction
    const newParticipant = await Participant.query().insertGraphAndFetch([data], { relate: true });
    return res.status(201).json(newParticipant);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(err.issues);
    }
    return res.status(400).send([{ message: 'Unable to create participant' }]);
  }
});

const invitationParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.nativeEnum(UserRole),
});

participantsRouter.post(
  '/:participantId/invite',
  hasParticipantAccess,
  async (req: ParticipantRequest, res: Response) => {
    try {
      const { participantId } = idParser.parse(req.params);
      const { firstName, lastName, email, role } = invitationParser.parse(req.body);
      const kcAdminClient = await getKcAdminClient();
      const user = await createNewUser(kcAdminClient, firstName, lastName, email);
      await createUserInPortal({ email, role, participantId, firstName, lastName });
      await sendInviteEmail(kcAdminClient, user);
      return res.sendStatus(201);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).send(err.issues);
      }
    }
  }
);

const participantParser = ParticipantSchema.pick({
  allowSharing: true,
  location: true,
});
participantsRouter.put(
  '/:participantId',
  hasParticipantAccess,
  async (req: ParticipantRequest, res: Response) => {
    try {
      const { location, allowSharing } = participantParser.parse(req.body);

      const { participant } = req;
      await participant!.$query().patch({ location, allowSharing });
      return res.sendStatus(200);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).send(err.issues);
      }
    }
  }
);
