import { Response } from 'express';

import { UserRoleId } from '../../entities/UserRole';
import { GetParticipantAuditTrail } from '../../services/auditTrailService';
import { UserParticipantRequest } from '../../services/participantsService';

export async function getAuditTrail(req: UserParticipantRequest, res: Response) {
  const { participant, user } = req;
  const userParticipant = user?.participants?.find((item) => item.id === participant?.id);
  if (
    userParticipant?.currentUserRoleIds?.filter(
      ((item) => {
        return item === UserRoleId.Admin || item === UserRoleId.UID2Support;
      }) ?? []
    ).length === 0
  ) {
    return res.status(500).json({ message: 'Permission Denied' });
  }
  const auditTrail = await GetParticipantAuditTrail(req.participant!);
  return res.status(200).json(auditTrail ?? []);
}
