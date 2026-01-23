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

  const participant = await Participant.query()
    .findById(participantId)
    .withGraphFetched('[types, primaryContact]');

  if (!participant || !(await canUserAccessParticipant(req, participantId, traceId))) {
    return res.status(403).json({
      message: 'You do not have access to this participant.',
      errorHash: traceId,
    });
  }

  req.participant = participant;
  return next();
};
