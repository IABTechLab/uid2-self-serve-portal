import { NextFunction, Response } from 'express';
import { z } from 'zod';

import { Participant } from '../entities/Participant';
import { getTraceId } from '../helpers/loggingHelpers';
import { ParticipantRequest } from '../services/participantsService';
import { findUserByEmail } from '../services/usersService';
import { isUserBelongsToParticipant, userHasUid2SupportRole } from './usersMiddleware';

const idParser = z.object({
  participantId: z.coerce.number(),
});

const hasParticipantAccess = async (req: ParticipantRequest, res: Response, next: NextFunction) => {
  const { participantId } = idParser.parse(req.params);
  const traceId = getTraceId(req);
  const participant = await Participant.query().findById(participantId).withGraphFetched('types');
  if (!participant) {
    return res.status(404).send([{ message: 'The participant cannot be found.' }]);
  }

  const currentUserEmail = req.auth?.payload?.email as string;
  const currentUserIsUid2Support = await userHasUid2SupportRole(currentUserEmail);

  const userHasAccessToParticipant =
    currentUserIsUid2Support ||
    (await isUserBelongsToParticipant(currentUserEmail, participantId, traceId));

  if (!userHasAccessToParticipant) {
    return res.status(403).send([{ message: 'You do not have permission to that participant.' }]);
  }

  req.participant = participant;
  return next();
};

const enrichCurrentParticipant = async (
  req: ParticipantRequest,
  res: Response,
  next: NextFunction
) => {
  const userEmail = req.auth?.payload?.email as string;
  const user = await findUserByEmail(userEmail);
  if (!user) {
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }
  // TODO: This just gets the user's first participant, but it will need to get the currently selected participant as part of UID2-2822
  const participant = user.participants?.[0];

  if (!participant) {
    return res.status(404).send([{ message: 'The participant cannot be found.' }]);
  }
  req.participant = participant;
  return next();
};

export const checkParticipantId = async (
  req: ParticipantRequest,
  res: Response,
  next: NextFunction
) => {
  // TODO: Remove support for 'current' in UID2-2822
  if (req.params.participantId === 'current') {
    return enrichCurrentParticipant(req, res, next);
  }
  return hasParticipantAccess(req, res, next);
};
