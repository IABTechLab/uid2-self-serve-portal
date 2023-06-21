import { Approver } from '../entities/Approver';

export const findApproversByType = async (typeIds: number[]) => {
  return Approver.query().distinct('email').whereIn('participantTypeId', typeIds);
};
