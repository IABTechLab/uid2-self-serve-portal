import express, { Response } from 'express';

import { ApiRoleDTO } from '../../entities/ApiRole';
import { Participant } from '../../entities/Participant';
import { isApproverCheck } from '../../middleware/approversMiddleware';
import { verifyAndEnrichParticipant } from '../../middleware/participantsMiddleware';
import { enrichCurrentUser } from '../../middleware/usersMiddleware';
import { getApiRoles } from '../../services/apiKeyService';
import {
  ParticipantRequest,
  updateParticipant,
  UserParticipantRequest,
} from '../../services/participantsService';
import { createBusinessContactsRouter } from '../businessContactsRouter';
import { createParticipantUsersRouter } from '../participantUsersRouter';
import {
  handleAddApiKey,
  handleDeleteApiKey,
  handleGetParticipantApiKey,
  handleGetParticipantApiKeys,
  handleUpdateApiKey,
} from './participantsApiKeys';
import { handleGetParticipantAppNames, handleSetParticipantAppNames } from './participantsAppIds';
import {
  handleApproveParticipant,
  handleGetApprovedParticipants,
  handleGetParticipantsAwaitingApproval,
} from './participantsApproval';
import { handleAuditTrail } from './participantsAuditTrail';
import {
  handleCreateParticipant,
  handleCreateParticipantFromRequest,
} from './participantsCreation';
import {
  handleGetParticipantDomainNames,
  handleSetParticipantDomainNames,
} from './participantsDomainNames';
import {
  handleAddKeyPair,
  handleDeleteKeyPair,
  handleGetParticipantKeyPairs,
  handleUpdateKeyPair,
} from './participantsKeyPairs';
import {
  handleAddSharingPermission,
  handleGetSharingPermission,
  handleRemoveSharingPermission,
  handleUpdateSharingTypes,
} from './participantsSharingPermissions';
import { handleGetSignedParticipants } from './participantsSigned';
import {
  handleGetParticipantUsers,
  handleGetUserRolesForCurrentParticipant,
  handleInviteUserToParticipant,
} from './participantsUsers';

const handleUpdateParticipant = async (req: UserParticipantRequest, res: Response) => {
  const { participant } = req;
  if (!participant) {
    return res.status(404).send('Unable to find participant');
  }
  await updateParticipant(participant, req);
  return res.sendStatus(200);
};

const handleGetParticipant = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  return res.status(200).json(participant);
};

const handleGetParticipantApiRoles = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  const apiRoles: ApiRoleDTO[] = await getApiRoles(participant!);
  return res.status(200).json(apiRoles);
};

const handleCompleteRecommendations = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  const updatedParticipant = await Participant.query()
    .patchAndFetchById(participant!.id, {
      completedRecommendations: true,
    })
    .withGraphFetched('types');
  return res.status(200).json(updatedParticipant);
};

export function createParticipantsRouter() {
  const participantsRouter = express.Router();

  participantsRouter.get('/signed', handleGetSignedParticipants);
  participantsRouter.post('/', handleCreateParticipantFromRequest);

  participantsRouter.get(
    '/awaitingApproval',
    isApproverCheck,
    handleGetParticipantsAwaitingApproval
  );
  participantsRouter.get('/approved', isApproverCheck, handleGetApprovedParticipants);

  participantsRouter.use('/:participantId', enrichCurrentUser);

  participantsRouter.put('/:participantId/approve', isApproverCheck, handleApproveParticipant);
  participantsRouter.put('/:participantId', isApproverCheck, handleUpdateParticipant);
  participantsRouter.put('/', handleCreateParticipant);

  participantsRouter.use('/:participantId', verifyAndEnrichParticipant);

  participantsRouter.get('/:participantId', handleGetParticipant);
  participantsRouter.get('/:participantId/apiRoles', handleGetParticipantApiRoles);
  participantsRouter.post('/:participantId/invite', handleInviteUserToParticipant);
  participantsRouter.put('/:participantId/completeRecommendations', handleCompleteRecommendations);

  participantsRouter.get('/:participantId/sharingPermission', handleGetSharingPermission);
  participantsRouter.post('/:participantId/sharingPermission/add', handleAddSharingPermission);
  participantsRouter.post(
    '/:participantId/sharingPermission/shareWithTypes',
    handleUpdateSharingTypes
  );
  participantsRouter.post(
    '/:participantId/sharingPermission/delete',
    handleRemoveSharingPermission
  );

  participantsRouter.get('/:participantId/apiKeys', handleGetParticipantApiKeys);
  participantsRouter.get('/:participantId/apiKey', handleGetParticipantApiKey);
  participantsRouter.put('/:participantId/apiKey', handleUpdateApiKey);
  participantsRouter.post('/:participantId/apiKey', handleAddApiKey);
  participantsRouter.delete('/:participantId/apiKey', handleDeleteApiKey);

  participantsRouter.get('/:participantId/keyPairs', handleGetParticipantKeyPairs);
  participantsRouter.post('/:participantId/keyPair/add', handleAddKeyPair);
  participantsRouter.post('/:participantId/keyPair/update', handleUpdateKeyPair);
  participantsRouter.delete('/:participantId/keyPair', handleDeleteKeyPair);

  participantsRouter.get('/:participantId/domainNames', handleGetParticipantDomainNames);
  participantsRouter.post('/:participantId/domainNames', handleSetParticipantDomainNames);

  participantsRouter.get('/:participantId/appNames', handleGetParticipantAppNames);
  participantsRouter.post('/:participantId/appNames', handleSetParticipantAppNames);
  participantsRouter.get('/:participantId/auditTrail', handleAuditTrail);

  participantsRouter.get('/:participantId/users', handleGetParticipantUsers);
  participantsRouter.get('/:participantId/:userId', handleGetUserRolesForCurrentParticipant);
  const participantUsersRouter = createParticipantUsersRouter();
  participantsRouter.use('/:participantId/users', participantUsersRouter);
  participantsRouter.use('/:participantId/:userId', participantUsersRouter);

  const businessContactsRouter = createBusinessContactsRouter();
  participantsRouter.use('/:participantId/businessContacts', businessContactsRouter);

  return { router: participantsRouter, businessContactsRouter };
}
