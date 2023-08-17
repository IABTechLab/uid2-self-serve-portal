import express from 'express';

import { isApproverCheck } from '../middleware/approversMiddleware';
import { getSiteList } from '../services/adminServiceClient';

export function createSitesRouter() {
  const sitesRouter = express.Router();

  sitesRouter.use('/', isApproverCheck);

  sitesRouter.get('/', async (_req, res) => {
    const sites = await getSiteList();
    return res.status(200).json(sites);
  });

  return sitesRouter;
}
