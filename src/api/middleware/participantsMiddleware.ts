import { NextFunction, Response } from 'express';
import { z } from 'zod';

import { Participant } from '../entities/Participant';
import { getTraceId } from '../helpers/loggingHelpers';
import { ParticipantRequest } from '../services/participantsService';
import { isUid2Support, isUserBelongsToParticipant } from './usersMiddleware';

const idParser = z.object({
  participantId: z.coerce.number(),
});

export const hasParticipantAccess = async (req: ParticipantRequest, res: Response, next: NextFunction) => {
  const { participantId } = idParser.parse(req.params);
  const traceId = getTraceId(req);
  const participant = await Participant.query().findById(participantId).withGraphFetched('types');
  if (!participant) {
    return res.status(404).send([{ message: 'The participant cannot be found.' }]);
  }

  const userEmail = req.auth?.payload?.email as string;
  const isUserUid2Support = await isUid2Support(userEmail);

  const canUserAccessParticipant =
    isUserUid2Support || (await isUserBelongsToParticipant(userEmail, participantId, traceId));

  if (!canUserAccessParticipant) {
    return res.status(403).send([{ message: 'You do not have permission to that participant.' }]);
  }

  req.participant = participant;
  return next();
};
