import express from 'express';

import {
  canBeSharedWith,
  convertSiteToSharingSiteDTO,
  SharingSiteDTO,
} from '../helpers/siteConvertingHelpers';
import { isApproverCheck } from '../middleware/approversMiddleware';
import { getSiteList, getVisibleSiteList } from '../services/adminServiceClient';
import { mapAdminSitesToSiteDTOs, SiteAdmin } from '../services/adminServiceHelpers';
import { getAttachedSiteIDs, getParticipantsBySiteIds } from '../services/participantsService';

export function createSitesRouter() {
  const sitesRouter = express.Router();

  sitesRouter.get('/unattached/', isApproverCheck, async (_req, res) => {
    const allSitesPromise = getSiteList();
    const attachedSitesPromise = getAttachedSiteIDs();
    const [allSites, attachedSites] = await Promise.all([allSitesPromise, attachedSitesPromise]);
    const siteDTOs = mapAdminSitesToSiteDTOs(allSites.filter((s) => !attachedSites.includes(s.id)));
    return res.status(200).json(siteDTOs);
  });

  sitesRouter.get('/available', async (_req, res) => {
    const visibleSites = await getVisibleSiteList();
    const availableSites = visibleSites.filter(canBeSharedWith);
    const matchedParticipants = await getParticipantsBySiteIds(availableSites.map((s) => s.id));
    const availableSharingSites: SharingSiteDTO[] = availableSites.map((site: SiteAdmin) =>
      convertSiteToSharingSiteDTO(site, matchedParticipants)
    );
    return res.status(200).json(availableSharingSites);
  });

  sitesRouter.get('/', async (_req, res) => {
    const visibleSites = await getVisibleSiteList();
    const matchedParticipants = await getParticipantsBySiteIds(visibleSites.map((s) => s.id));
    const sharingSites: SharingSiteDTO[] = visibleSites.map((site: SiteAdmin) =>
      convertSiteToSharingSiteDTO(site, matchedParticipants)
    );
    return res.status(200).json(sharingSites);
  });

  return sitesRouter;
}
