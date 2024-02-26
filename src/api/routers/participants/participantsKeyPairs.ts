import { Response } from 'express';

import { getKeyPairsList } from '../../services/adminServiceClient';
import { ParticipantRequest } from '../../services/participantsService';

export async function getParticipantKeyPairs(req: ParticipantRequest, res: Response) {
  const { participant } = req;
  if (!participant?.siteId) {
    return res.status(400).send('Site id is not set');
  }
  const siteId = participant?.siteId;
  const allKeyPairs = await getKeyPairsList(siteId!);
  return res.status(200).json(allKeyPairs);
}
