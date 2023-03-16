import express from 'express';
import { z } from 'zod';

import { Participant, ParticipantSchema } from './entities/Participant';
import { User } from './entities/User';

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
    return res.status(400).send('Unable to create participant');
  }
});

const idParser = z.object({
  participantId: z.string(),
});

participantsRouter.get('/:participantId/admin', async (req, res) => {
  const { participantId } = idParser.parse(req.params);
  const adminUsers = await User.query()
    .where('role', 'admin')
    .where('participantId', participantId);
  res.status(200).json(adminUsers);
});
