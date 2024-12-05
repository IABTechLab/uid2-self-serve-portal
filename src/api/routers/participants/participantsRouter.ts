import express from 'express';

import { verifyAndEnrichParticipant } from '../../middleware/participantsMiddleware';
import { isAdminOrUid2SupportCheck, isUid2SupportCheck } from '../../middleware/userRoleMiddleware';
import { enrichCurrentUser } from '../../middleware/usersMiddleware';
import { createBusinessContactsRouter } from '../businessContactsRouter';
import { createParticipantUsersRouter } from '../participantUsersRouter';
import {
  handleCompleteRecommendations,
  handleGetParticipant,
  handleUpdateParticipant,
} from './participants';
import {
  handleAddApiKey,
  handleDeleteApiKey,
  handleGetParticipantApiKey,
  handleGetParticipantApiKeys,
  handleUpdateApiKey,
} from './participantsApiKeys';
import { handleGetParticipantApiRoles } from './participantsApiRoles';
import { handleGetParticipantAppNames, handleSetParticipantAppNames } from './participantsAppIds';
import { handleApproveParticipant, handleGetApprovedParticipants } from './participantsApproval';
import { handleGetAuditTrail } from './participantsAuditTrail';
import { handleCreateParticipant } from './participantsCreation';
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
import { handleGetParticipantUsers, handleInviteUserToParticipant } from './participantsUsers';

export function createParticipantsRouter() {
  const participantsRouter = express.Router();

  participantsRouter.get('/signed', handleGetSignedParticipants);

  participantsRouter.get('/approved', isUid2SupportCheck, handleGetApprovedParticipants);

  participantsRouter.put('/', handleCreateParticipant);

  participantsRouter.use('/:participantId', verifyAndEnrichParticipant, enrichCurrentUser);

  participantsRouter.get('/:participantId', handleGetParticipant);
  participantsRouter.get('/:participantId/apiRoles', handleGetParticipantApiRoles);
  participantsRouter.put('/:participantId', handleUpdateParticipant);
  participantsRouter.put('/:participantId/completeRecommendations', handleCompleteRecommendations);
  participantsRouter.put('/:participantId/approve', handleApproveParticipant);

  participantsRouter.post(
    '/:participantId/invite',
    isAdminOrUid2SupportCheck,
    handleInviteUserToParticipant
  );
  participantsRouter.get(
    '/:participantId/auditTrail',
    isAdminOrUid2SupportCheck,
    handleGetAuditTrail
  );

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

  participantsRouter.get('/:participantId/users', handleGetParticipantUsers);
  const participantUsersRouter = createParticipantUsersRouter();
  participantsRouter.use('/:participantId/users', participantUsersRouter);

  const businessContactsRouter = createBusinessContactsRouter();
  participantsRouter.use('/:participantId/businessContacts', businessContactsRouter);

  return { router: participantsRouter, businessContactsRouter };
}
