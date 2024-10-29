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

export const isAdminCheck: Handler = async (req: ParticipantRequest, res, next) => {
  const { participant } = req;
  const user = await findUserByEmail(req.auth?.payload.email as string);
  const userParticipant = user?.participants?.find((item) => item.id === participant?.id);
  const userIsAdminOrUid2Support = userParticipant?.currentUserRoleIds?.some(
    (item) => item === UserRoleId.Admin || item === UserRoleId.UID2Support
  );
  if (!userIsAdminOrUid2Support) {
    return res.status(403).json({
      message: 'Unauthorized. You do not have the necessary permissions.',
      errorHash: req.headers.traceId,
    });
  }
  next();
};
