import express from 'express';

import { Participant } from '../entities/Participant';
import { isApproverCheck } from '../middleware/approversMiddleware';
import { getSiteList } from '../services/adminServiceClient';
import { GetAttachedSiteIDs } from '../services/participantsService';

export function createSitesRouter() {
  const sitesRouter = express.Router();

  sitesRouter.use('/', isApproverCheck);

  sitesRouter.get('/unattached/', async (_req, res) => {
    const allSitesPromise = getSiteList();
    const attachedSitesPromise = GetAttachedSiteIDs();
    const [allSites, attachedSites] = await Promise.all([allSitesPromise, attachedSitesPromise]);
    return res.status(200).json(allSites.filter((s) => !attachedSites.includes(s.id)));
  });

  return sitesRouter;
}
