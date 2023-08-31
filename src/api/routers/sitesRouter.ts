import express from 'express';

import { ParticipantType } from '../entities/ParticipantType';
import {
  convertSiteToAvailableParticipantDTO,
  hasSharerRole,
} from '../helpers/siteConvertingHelpers';
import { isApproverCheck } from '../middleware/approversMiddleware';
import { getSiteList, SiteDTO } from '../services/adminServiceClient';

export function createSitesRouter() {
  const sitesRouter = express.Router();

  sitesRouter.get('/', isApproverCheck, async (_req, res) => {
    const sites = await getSiteList();
    return res.status(200).json(sites);
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
