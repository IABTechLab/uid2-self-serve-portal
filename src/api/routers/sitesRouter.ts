import express from 'express';

import { ParticipantType } from '../entities/ParticipantType';
import {
  convertSiteToAvailableParticipantDTO,
  hasSharerRole,
} from '../helpers/siteConvertingHelpers';
import { isApproverCheck } from '../middleware/approversMiddleware';
import { getSiteList } from '../services/adminServiceClient';
import { SiteDTO } from '../services/adminServiceHelpers';
import { GetAttachedSiteIDs } from '../services/participantsService';

export function createSitesRouter() {
  const sitesRouter = express.Router();

  sitesRouter.get('/unattached/', isApproverCheck, async (_req, res) => {
    const allSitesPromise = getSiteList();
    const attachedSitesPromise = GetAttachedSiteIDs();
    const [allSites, attachedSites] = await Promise.all([allSitesPromise, attachedSitesPromise]);
    return res.status(200).json(allSites.filter((s) => !attachedSites.includes(s.id)));
  });

  sitesRouter.get('/available', async (_req, res) => {
    const sites = await getSiteList();
    const availableSites = sites.filter(hasSharerRole);
    const participantTypes = await ParticipantType.query();
    const availableParticipants = availableSites.map((site: SiteDTO) =>
      convertSiteToAvailableParticipantDTO(site, participantTypes)
    );
    return res.status(200).json(availableParticipants);
  });

  return sitesRouter;
}
