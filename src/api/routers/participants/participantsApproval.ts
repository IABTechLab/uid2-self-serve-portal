import { Response } from 'express';

import { AuditTrailEvents } from '../../entities/AuditTrail';
import { ParticipantApprovalPartial, ParticipantStatus } from '../../entities/Participant';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getKcAdminClient } from '../../keycloakAdminClient';
import { setSiteClientTypes } from '../../services/adminServiceClient';
import { ParticipantApprovalResponse } from '../../services/adminServiceHelpers';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import { assignApiParticipantMemberRole } from '../../services/kcUsersService';
import {
  getParticipantsApproved,
  getParticipantsAwaitingApproval,
  mapParticipantToApprovalRequest,
  ParticipantRequest,
  ParticipantRequestDTO,
  sendParticipantApprovedEmail,
  updateParticipantAndTypesAndApiRoles,
  UserParticipantRequest,
} from '../../services/participantsService';
import { getAllUsersFromParticipant } from '../../services/usersService';

export const handleGetParticipantsAwaitingApproval = async (
  req: ParticipantRequest,
  res: Response
) => {
  const participantsAwaitingApproval = await getParticipantsAwaitingApproval();
  const result: ParticipantRequestDTO[] = participantsAwaitingApproval.map(
    mapParticipantToApprovalRequest
  );
  return res.status(200).json(result);
};

export const handleGetApprovedParticipants = async (_req: ParticipantRequest, res: Response) => {
  const participants = await getParticipantsApproved();
  const result = participants.sort((a, b) => a.name.localeCompare(b.name));
  return res.status(200).json(result);
};

export const handleApproveParticipant = async (req: UserParticipantRequest, res: Response) => {
  const { participant, user } = req;
  const traceId = getTraceId(req);
  const data = {
    ...ParticipantApprovalPartial.parse(req.body),
    status: ParticipantStatus.Approved,
    approverId: user?.id,
    dateApproved: new Date(),
  };

  const auditTrailInsertObject = constructAuditTrailObject(
    user!,
    AuditTrailEvents.ApproveAccount,
    {
      oldName: participant?.name,
      siteId: data.siteId!,
      newName: data.name,
      oldTypeIds: participant?.types!.map((type) => type.id),
      newTypeIds: data.types.map((type) => type.id),
      apiRoles: data.apiRoles.map((role) => role.id),
    },
    participant!.id
  );

  const users = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => {
      const kcAdminClient = await getKcAdminClient();
      const usersFromParticipant = await getAllUsersFromParticipant(participant!);
      // if there are no users, send email to the approver
      const emailRecipient = usersFromParticipant.length > 0 ? usersFromParticipant : [user!];
      await setSiteClientTypes(data);
      await Promise.all(
        usersFromParticipant.map((currentUser) =>
          assignApiParticipantMemberRole(kcAdminClient, currentUser.email)
        )
      );

      await updateParticipantAndTypesAndApiRoles(participant!, data);
      await sendParticipantApprovedEmail(emailRecipient, traceId);

      return usersFromParticipant;
    }
  );

  const approvalResponse: ParticipantApprovalResponse = {
    users,
  };

  return res.status(200).json(approvalResponse);
};
