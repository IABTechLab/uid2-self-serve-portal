import express from 'express';

import { isUid2SuperuserCheck2 } from '../middleware/userRoleMiddleware';
import { getAdminUserList } from '../services/usersService';
// import { getSiteList, getVisibleSiteList } from '../services/adminServiceClient';
// import { AdminSiteDTO, mapAdminSitesToSiteDTOs } from '../services/adminServiceHelpers';
// import { getAttachedSiteIDs, getParticipantsBySiteIds } from '../services/participantsService';

export function createAdminRouter() {
  const adminRouter = express.Router();

  adminRouter.get('/users', isUid2SuperuserCheck2, async (_req, res) => {
    // const allSitesPromise = getSiteList();
    // const attachedSitesPromise = getAttachedSiteIDs();
    // const [allSites, attachedSites] = await Promise.all([allSitesPromise, attachedSitesPromise]);
    // const siteDTOs = await mapAdminSitesToSiteDTOs(
    //   allSites.filter((s) => !attachedSites.includes(s.id))
    // );
    const userList = await getAdminUserList();
    return res.status(200).json(userList);
  });

  return adminRouter;
}
