import { Handler } from 'express';

import { UserRoleId } from '../entities/UserRole';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';
import { ParticipantRequest } from '../services/participantsService';
import { findUserByEmail } from '../services/usersService';

export const isUid2Support = async (userEmail: string) => {
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

export const isUid2SuperuserCheck2: Handler = async (req: ParticipantRequest, res, next) => {
  // check superuser role here once we have it
  next();
};

export const isAdminOrUid2SupportCheck: Handler = async (req: ParticipantRequest, res, next) => {
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
