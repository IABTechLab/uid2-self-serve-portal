import { Handler, Request } from 'express';

import { UserRoleId } from '../entities/UserRole';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';
import { ParticipantRequest } from '../services/participantsService';
import { findUserByEmail } from '../services/usersService';

export const isUid2InternalEmail = (email: string) => email.toLowerCase().includes('@unifiedid.com');

export const isUid2Support = async (userEmail: string) => {
  // TBU to superuser check after UID2Support logic is updated
  if (isUid2InternalEmail(userEmail)) {
    return true;
  }
  const user = await findUserByEmail(userEmail);
  const userWithUid2SupportRole = await UserToParticipantRole.query()
    .where('userId', user!.id)
    .andWhere('userRoleId', UserRoleId.UID2Support)
    .first();
  return !!userWithUid2SupportRole;
};

export const isUid2SupportCheck: Handler = async (req: ParticipantRequest, res, next) => {
  if (!(await isUid2Support(req.auth?.payload?.email as string))) {
    return res.status(403).json({
      message: 'Unauthorized. You do not have the necessary permissions.',
      errorHash: req.headers.traceId,
    });
  }
  next();
};

export const isSuperUser = (req: Request) => {
  const userEmail = req.auth?.payload?.email as string;
  return isUid2InternalEmail(userEmail);
};

export const isSuperUserCheck: Handler = async (req: ParticipantRequest, res, next) => {
  if (!isSuperUser(req)) {
    return res.status(403).json({
      message: 'Unauthorized. You do not have the necessary permissions.',
      errorHash: req.headers.traceId,
    });
  }
  next();
};

export const isAdminOrUid2SupportCheck: Handler = async (req: ParticipantRequest, res, next) => {
  if (isSuperUser(req)) {
    return next();
  }

  const { participant } = req;
  const userEmail = req.auth?.payload.email as string;
  const user = await findUserByEmail(userEmail);
  const userParticipant = user?.participants?.find((item) => item.id === participant?.id);
  const userIsAdminOrUid2Support =
    userParticipant?.currentUserRoleIds?.includes(UserRoleId.Admin) ||
    (await isUid2Support(userEmail));
  if (!userIsAdminOrUid2Support) {
    return res.status(403).json({
      message: 'Unauthorized. You do not have the necessary permissions.',
      errorHash: req.headers.traceId,
    });
  }
  next();
};
