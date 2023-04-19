import { Request } from 'express';

import { findUserByEmail } from './usersService';

export async function getLoggedInParticipantId(req: Request) {
  const loggedInEmail = req.auth?.payload?.email as string;
  if (!loggedInEmail) return null;

  const loggedInUser = await findUserByEmail(loggedInEmail);
  if (!loggedInUser) return null;

  return loggedInUser.participantId;
}
