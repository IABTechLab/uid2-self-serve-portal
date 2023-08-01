import { Handler } from 'express';

import { Approver } from '../entities/Approver';

export const findApproversByType = async (typeIds: number[]) => {
  return Approver.query().distinct('email').whereIn('participantTypeId', typeIds);
};

export const isUserAnApprover = async (email: string) => {
  const userInApproversTable = await Approver.query().findOne('email', email);
  return userInApproversTable !== undefined;
};

export const getApprovableParticipantTypeIds = async (email: string) => {
  const approvers = await Approver.query().distinct('participantTypeId').where('email', email);
  return approvers.map((approver) => approver.participantTypeId);
};

export const isApproverCheck: Handler = async (req, res, next) => {
  if (!isUserAnApprover(req.auth?.payload?.email as string)) {
    res.status(401).json({
      message: 'Unauthorized. You do not have the necessary permissions.',
      errorHash: req.headers.traceId,
    });
  }
  next();
};
