import { Handler, Request } from 'express';

import { UserRoleId } from '../entities/UserRole';
import { ParticipantRequest } from '../services/participantsService';
import { findUserByEmail } from '../services/usersService';

export const uid2SupportRole = 'prod-uid2.0-support';
export const developerRole = 'developer';
export const developerElevatedRole = 'developer-elevated';

export const isUid2InternalEmail = (email: string) => email.toLowerCase().includes('@unifiedid.com');

// assign super user if user is developer-elevated in okta
export const isSuperUser = (req: Request) => {
  const oktaGroups = (req.auth?.payload?.groups as string[] | undefined) ?? [];
  return oktaGroups.includes(developerElevatedRole);
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

// assign uid2 support if user is developer or developer-elevated in okta
// assign uid2 support if user has prod-uid2.0-support in Microsoft Entra ID
export const isUid2Support = async (req: Request) => {
  const authGroups = (req.auth?.payload?.groups as string[] | undefined) ?? [];
  if (isSuperUser(req) || authGroups.includes(developerRole) || authGroups.includes(uid2SupportRole)) {
    return true;
  }

  return false;
};

export const isUid2SupportCheck: Handler = async (req: ParticipantRequest, res, next) => {
  if (!(await isUid2Support(req))) {
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
    (await isUid2Support(req));
  if (!userIsAdminOrUid2Support) {
    return res.status(403).json({
      message: 'Unauthorized. You do not have the necessary permissions.',
      errorHash: req.headers.traceId,
    });
  }
  next();
};
