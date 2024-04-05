import { Handler } from 'express';

import { Participant } from '../entities/Participant';
import { getApprovableParticipantTypeIds, isUserAnApprover } from '../services/approversService';
import { ParticipantRequest } from '../services/participantsService';

export const isApproverCheck: Handler = async (req: ParticipantRequest, res, next) => {
  if (!(await isUserAnApprover(req.auth?.payload?.email as string))) {
    return res.status(403).json({
      message: 'Unauthorized. You do not have the necessary permissions.',
      errorHash: req.headers.traceId,
    });
  }
  if (req.params.participantId) {
    const participant = await Participant.query()
      .findById(req.params.participantId)
      .withGraphFetched('types');
    const typeIds = await getApprovableParticipantTypeIds(req.auth?.payload?.email as string);
    if (
      participant &&
      participant.types!.length > 0 &&
      !participant?.types!.some((type) => typeIds.includes(type.id))
    ) {
      return res.status(403).json({
        message: 'Unauthorized. You do not permission to update this participant.',
        errorHash: req.headers.traceId,
      });
    }
    req.participant = participant;
  }
  next();
};
