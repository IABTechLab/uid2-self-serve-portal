import express from 'express';
import { z } from 'zod';

import { Participant, ParticipantSchema } from './entities/Participant';
import { UserRole } from './entities/User';
import { inviteNewUser } from './services/usersService';

export const participantsRouter = express.Router();
participantsRouter.get('/', async (_req, res) => {
  const participants = await Participant.query();
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

const idParser = z.object({
  participantId: z.string(),
});

const invitationParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  jobFunction: z.nativeEnum(UserRole),
});

participantsRouter.post('/:participantId/invite', async (req, res) => {
  try {
    const { participantId } = idParser.parse(req.params);
    if (!(await Participant.query().findById(participantId))) {
      return res.status(404).send([{ message: 'Participant not exist' }]);
    }
    const { firstName, lastName, email, jobFunction } = invitationParser.parse(req.body);
    await inviteNewUser(firstName, lastName, email, jobFunction, participantId);
    return res.sendStatus(201);
  } catch (e) {
    console.log(e);
    return res.status(500).json('Something went wrong please try again');
  }
});
