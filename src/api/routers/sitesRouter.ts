import express from 'express';

import { getSiteList } from '../services/adminServiceClient';

export function createSitesRouter() {
  const sitesRouter = express.Router();

  sitesRouter.get('/', async (_req, res) => {
    const sites = await getSiteList();
    return res.status(200).json(sites);
  });

  return sitesRouter;
}
