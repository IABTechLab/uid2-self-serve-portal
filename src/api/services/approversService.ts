import { Approver } from '../entities/Approver';

export const findApproversByType = async (typeIds: number[]) => {
  return Approver.query().distinct('email').whereIn('participantTypeId', typeIds);
};

export const isUserAnApprover = async (email: string) => {
  const userInApproversTable = await Approver.query().findOne('email', email);
  return userInApproversTable !== undefined;
};
