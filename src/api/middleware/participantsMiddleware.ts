import { NextFunction, Response } from 'express';
import { z } from 'zod';

import { Participant } from '../entities/Participant';
import { ParticipantType } from '../entities/ParticipantType';
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
	//console.log(Participant.relationMappings);
	//console.log(Participant.getRelation('types'))
  let participant = await Participant.query().findById(participantId).withGraphFetched('types');

  if (!(await canUserAccessParticipant(userEmail, participantId, traceId))) {
    participant = undefined;
  }

  req.participant = participant;
  return next();
};
