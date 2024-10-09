import { NextFunction, Response } from 'express';
import { z } from 'zod';

import { Participant } from '../entities/Participant';
import { getTraceId } from '../helpers/loggingHelpers';
import { ParticipantRequest } from '../services/participantsService';
import { canUserAccessParticipant } from './usersMiddleware';

const participantIdSchema = z.object({
  participantId: z.coerce.number(),
});
export const verifyAndEnrichParticipant = async (
  req: ParticipantRequest,
  res: Response,
  next: NextFunction
) => {
  const { participantId } = participantIdSchema.parse(req.params);
  const traceId = getTraceId(req);
  const userEmail = req.auth?.payload?.email as string;

  const participant = await Participant.query().findById(participantId).withGraphFetched('types');
  if (!participant) {
    return res.status(404).send([{ message: 'The participant cannot be found.' }]);
  }

  if (!(await canUserAccessParticipant(userEmail, participantId, traceId))) {
    res.status(403).send([{ message: 'You do not have access to that participant.' }]);
  }

  req.participant = participant;
  return next();
};
