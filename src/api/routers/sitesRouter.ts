import express, { Response } from 'express';

import { getTraceId } from '../helpers/loggingHelpers';
import {
  canBeSharedWith,
  convertSiteToSharingSiteDTO,
  SharingSiteDTO,
} from '../helpers/siteConvertingHelpers';
import { isUid2SupportCheck } from '../middleware/userRoleMiddleware';
import { getSiteList, getVisibleSiteList } from '../services/adminServiceClient';
import { AdminSiteDTO, mapAdminSitesToSiteDTOs } from '../services/adminServiceHelpers';
import {
  getAttachedSiteIDs,
  getParticipantsBySiteIds,
  ParticipantRequest,
} from '../services/participantsService';

const handleGetSharingSites = async (req: ParticipantRequest, res: Response) => {
  const traceId = getTraceId(req);
  const visibleSites = await getVisibleSiteList(traceId);
  const matchedParticipants = await getParticipantsBySiteIds(visibleSites.map((s) => s.id));
  const sharingSites: SharingSiteDTO[] = visibleSites.map((site: AdminSiteDTO) =>
    convertSiteToSharingSiteDTO(site, matchedParticipants)
  );
  return res.status(200).json(sharingSites);
};

const handleGetAvailableSharingSites = async (req: ParticipantRequest, res: Response) => {
  const traceId = getTraceId(req);
  const visibleSites = await getVisibleSiteList(traceId);
  const availableSites = visibleSites.filter(canBeSharedWith);
  const matchedParticipants = await getParticipantsBySiteIds(availableSites.map((s) => s.id));
  const availableSharingSites: SharingSiteDTO[] = availableSites.map((site: AdminSiteDTO) =>
    convertSiteToSharingSiteDTO(site, matchedParticipants)
  );
  return res.status(200).json(availableSharingSites);
};

const handleGetUnattachedSites = async (req: ParticipantRequest, res: Response) => {
  const traceId = getTraceId(req);
  const allSitesPromise = getSiteList(traceId);
  const attachedSitesPromise = getAttachedSiteIDs();
  const [allSites, attachedSites] = await Promise.all([allSitesPromise, attachedSitesPromise]);
  const siteDTOs = await mapAdminSitesToSiteDTOs(
    allSites.filter((s) => !attachedSites.includes(s.id))
  );
  return res.status(200).json(siteDTOs);
};

export function createSitesRouter() {
  const sitesRouter = express.Router();

  sitesRouter.get('/', handleGetSharingSites);
  sitesRouter.get('/available', handleGetAvailableSharingSites);
  sitesRouter.get('/unattached/', isUid2SupportCheck, handleGetUnattachedSites);

  return sitesRouter;
}
