import express from 'express';

import { getTraceId } from '../helpers/loggingHelpers';
import {
  canBeSharedWith,
  convertSiteToSharingSiteDTO,
  SharingSiteDTO,
} from '../helpers/siteConvertingHelpers';
import { isUid2SupportCheck } from '../middleware/userRoleMiddleware';
import { getSiteList, getVisibleSiteList } from '../services/adminServiceClient';
import { AdminSiteDTO, mapAdminSitesToSiteDTOs } from '../services/adminServiceHelpers';
import { getAttachedSiteIDs, getParticipantsBySiteIds } from '../services/participantsService';

export function createSitesRouter() {
  const sitesRouter = express.Router();

  sitesRouter.get('/unattached/', isUid2SupportCheck, async (_req, res) => {
    const traceId = getTraceId(_req);
    const allSitesPromise = getSiteList(traceId);
    const attachedSitesPromise = getAttachedSiteIDs();
    const [allSites, attachedSites] = await Promise.all([allSitesPromise, attachedSitesPromise]);
    const siteDTOs = await mapAdminSitesToSiteDTOs(
      allSites.filter((s) => !attachedSites.includes(s.id))
    );
    return res.status(200).json(siteDTOs);
  });

  sitesRouter.get('/available', async (_req, res) => {
    const traceId = getTraceId(_req);
    const visibleSites = await getVisibleSiteList(traceId);
    const availableSites = visibleSites.filter(canBeSharedWith);
    const matchedParticipants = await getParticipantsBySiteIds(availableSites.map((s) => s.id));
    const availableSharingSites: SharingSiteDTO[] = availableSites.map((site: AdminSiteDTO) =>
      convertSiteToSharingSiteDTO(site, matchedParticipants)
    );
    return res.status(200).json(availableSharingSites);
  });

  sitesRouter.get('/', async (_req, res) => {
    const traceId = getTraceId(_req);
    const visibleSites = await getVisibleSiteList(traceId);
    const matchedParticipants = await getParticipantsBySiteIds(visibleSites.map((s) => s.id));
    const sharingSites: SharingSiteDTO[] = visibleSites.map((site: AdminSiteDTO) =>
      convertSiteToSharingSiteDTO(site, matchedParticipants)
    );
    return res.status(200).json(sharingSites);
  });

  return sitesRouter;
}
