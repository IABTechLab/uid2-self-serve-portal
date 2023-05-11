import express from 'express';
import { z } from 'zod';

import { Participant, ParticipantSchema } from './entities/Participant';
import { ParticipantType } from './entities/ParticipantType';
import { UserRole } from './entities/User';
import { getKcAdminClient } from './keycloakAdminClient';
import { createNewUser, sendInviteEmail } from './services/kcUsersService';
import { sendNewParticipantEmail } from './services/participantsService';
import { createUserInPortal, isUserBelongsToParticipant } from './services/usersService';

export const participantsRouter = express.Router();
participantsRouter.get('/', async (_req, res) => {
  const participants = await Participant.query();
  return res.status(200).json(participants);
});

participantsRouter.post('/', async (req, res) => {
  try {
    const data = ParticipantSchema.parse(req.body);
    // insertGraphAndFetch will implicitly create a transaction
    const newParticipant = await Participant.query().insertGraphAndFetch([data], {
      relate: true,
    });

    const participantTypes = await ParticipantType.query().findByIds(data.types!.map((t) => t.id));
    sendNewParticipantEmail(data, participantTypes);
    return res.status(201).json(newParticipant);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(err.issues);
    }
    return res.status(400).send([{ message: 'Unable to create participant' }]);
  }
});

const idParser = z.object({
  participantId: z.coerce.number(),
});

const invitationParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.nativeEnum(UserRole),
});

participantsRouter.post('/:participantId/invite', async (req, res) => {
  try {
    const { participantId } = idParser.parse(req.params);
    if (!(await Participant.query().findById(participantId))) {
      return res.status(404).send([{ message: 'The participant cannot be found.' }]);
    }

    if (!(await isUserBelongsToParticipant(req.auth?.payload?.email as string, participantId))) {
      return res
        .status(401)
        .send([{ message: 'You do not have permission to make this invitation.' }]);
    }

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
    // TODO: Log the error so we can trouble-shoot.
    return res.status(500).send([
      {
        message:
          'An error occurred trying to send the invitation. Please try again later, and contact support if the problem persists.',
      },
    ]);
  }
});
