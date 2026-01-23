import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { User, UserJobFunction } from '../entities/User';
import { getLoggers, getTraceId, TraceId } from '../helpers/loggingHelpers';
import { getAllParticipants, UserParticipantRequest } from '../services/participantsService';
import { findUserByEmail, UserRequest } from '../services/usersService';
import { isSuperUser, isUid2InternalEmail, isUid2Support } from './userRoleMiddleware';

// Extended user type with support role flags
type UserWithSupportRoles = User & { isUid2Support: boolean; isSuperUser: boolean };

// Create a new @unifiedid.com user in the portal database from Keycloak token data
const createUid2InternalUser = async (
  email: string,
  firstName: string,
  lastName: string
): Promise<User> => {
  const newUser = await User.query().insert({
    email,
    firstName: firstName || 'UID2',
    lastName: lastName || 'Support',
    jobFunction: UserJobFunction.Engineering,
    acceptedTerms: true,
  });
  return newUser;
};

export const isUserBelongsToParticipant = async (
  email: string,
  participantId: number,
  traceId: TraceId
) => {
  const userWithParticipants = await User.query()
    .findOne({ email, deleted: 0 })
    .modify('withParticipants');

  if (!userWithParticipants) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`User with email ${email} not found`, traceId);
    return false;
  }
  for (const participant of userWithParticipants.participants!) {
    if (participant.id === participantId) {
      return true;
    }
  }
  return false;
};

export const canUserAccessParticipant = async (
  req: Request,
  participantId: number,
  traceId: TraceId
) => {
  const requestingUserEmail = req.auth?.payload?.email as string;
  // SuperUsers and UID2Support have access to all participants
  if (isSuperUser(req) || (await isUid2Support(requestingUserEmail))) {
    return true;
  }
  return isUserBelongsToParticipant(requestingUserEmail, participantId, traceId);
};

export const enrichCurrentUser = async (req: UserRequest, res: Response, next: NextFunction) => {
  const userEmail = req.auth?.payload?.email as string;
  let user = await findUserByEmail(userEmail);

  // Auto-create @unifiedid.com users if they don't exist in the portal database
  if (!user && isUid2InternalEmail(userEmail)) {
    const firstName = (req.auth?.payload?.given_name as string) || '';
    const lastName = (req.auth?.payload?.family_name as string) || '';
    await createUid2InternalUser(userEmail, firstName, lastName);
    user = await findUserByEmail(userEmail);
  }

  if (!user) {
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }
  if (user.locked) {
    return res.status(403).send([{ message: 'Unauthorized.' }]);
  }

  // Enrich user with support roles and participants
  const enrichedUser = user as UserWithSupportRoles;
  enrichedUser.isUid2Support = await isUid2Support(userEmail);
  enrichedUser.isSuperUser = isSuperUser(req);

  // SuperUsers and UID2Support get all participants
  if (enrichedUser.isSuperUser || enrichedUser.isUid2Support) {
    enrichedUser.participants = await getAllParticipants();
  }

  req.user = enrichedUser;
  return next();
};

const userIdSchema = z.object({
  userId: z.coerce.number(),
});
export const verifyAndEnrichUser = async (
  req: UserParticipantRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = userIdSchema.parse(req.params);
  const { participant } = req;
  const traceId = getTraceId(req);
  const targetUser = await User.query().findById(userId).modify('withParticipants');

  if (!targetUser) {
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }
  if (targetUser.participants?.length === 0) {
    return res.status(404).send([{ message: 'The participant for that user cannot be found.' }]);
  }

  const targetUserBelongsToParticipant = await isUserBelongsToParticipant(
    targetUser.email,
    participant!.id,
    traceId
  );
  if (!targetUserBelongsToParticipant) {
    const { infoLogger } = getLoggers();
    infoLogger.info('Target user does not belong to participant', traceId);
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }

  const canRequestingUserAccessParticipant = await canUserAccessParticipant(
    req,
    participant!.id,
    traceId
  );
  if (!canRequestingUserAccessParticipant) {
    return res.status(403).send([{ message: 'You do not have permission to that user account.' }]);
  }

  req.user = targetUser;
  return next();
};
