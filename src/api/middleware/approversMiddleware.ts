import { Handler, Request } from 'express';

import { getApprovableParticipantTypeIds, isUserAnApprover } from '../services/approversService';
import { ParticipantRequest } from '../services/participantsService';

function isParticipantRequest(req: Request | ParticipantRequest): req is ParticipantRequest {
  return (req as ParticipantRequest).participant !== undefined;
}

export const isApproverCheck: Handler = async (req: Request | ParticipantRequest, res, next) => {
  if (!(await isUserAnApprover(req.auth?.payload?.email as string))) {
    return res.status(403).json({
      message: 'Unauthorized. You do not have the necessary permissions.',
      errorHash: req.headers.traceId,
    });
  }
  if (isParticipantRequest(req)) {
    const typeIds = await getApprovableParticipantTypeIds(req.auth?.payload?.email as string);
    if (!req.participant?.types!.some((type) => typeIds.includes(type.id))) {
      return res.status(403).json({
        message: 'Unauthorized. You do not permission to update this participant.',
        errorHash: req.headers.traceId,
      });
    }
  }
  next();
};
