import { Response } from 'express';

import { siteIdNotSetError } from '../../helpers/errorHelpers';
import { getKeyPairsList } from '../../services/adminServiceClient';
import { ParticipantRequest } from '../../services/participantsService';

export async function getParticipantKeyPairs(req: ParticipantRequest, res: Response) {
  const { participant } = req;
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }
  const siteId = participant?.siteId;
  const allKeyPairs = await getKeyPairsList(siteId!);
  return res.status(200).json(allKeyPairs);
}
