import express from 'express';

import {
  canBeSharedWith,
  convertSiteToSharingSiteDTO,
  SharingSiteDTO,
} from '../helpers/siteConvertingHelpers';
import { isApproverCheck } from '../middleware/approversMiddleware';
import { getSiteList } from '../services/adminServiceClient';
import { SiteDTO } from '../services/adminServiceHelpers';
import { getAttachedSiteIDs, getParticipantsBySiteIds } from '../services/participantsService';

export function createSitesRouter() {
  const sitesRouter = express.Router();

  sitesRouter.get('/unattached/', isApproverCheck, async (_req, res) => {
    const allSitesPromise = getSiteList();
    const attachedSitesPromise = getAttachedSiteIDs();
    const [allSites, attachedSites] = await Promise.all([allSitesPromise, attachedSitesPromise]);
    return res.status(200).json(allSites.filter((s) => !attachedSites.includes(s.id)));
  });

  sitesRouter.get('/available', async (_req, res) => {
    const sites = await getSiteList();
    const availableSites = sites.filter(canBeSharedWith);
    const matchedParticipants = await getParticipantsBySiteIds(availableSites.map((s) => s.id));
    const availableSharingSites: SharingSiteDTO[] = availableSites.map((site: SiteDTO) =>
      convertSiteToSharingSiteDTO(site, matchedParticipants)
    );
    return res.status(200).json(availableSharingSites);
  });

  sitesRouter.get('/', async (_req, res) => {
    const sites = await getSiteList();
    const matchedParticipants = await getParticipantsBySiteIds(sites.map((s) => s.id));
    const sharingSites: SharingSiteDTO[] = sites.map((site: SiteDTO) =>
      convertSiteToSharingSiteDTO(site, matchedParticipants)
    );
    return res.status(200).json(sharingSites);
  });

  return sitesRouter;
}
