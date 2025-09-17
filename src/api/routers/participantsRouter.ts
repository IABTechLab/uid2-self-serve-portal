import express from 'express';

import { verifyAndEnrichParticipant } from '../middleware/participantsMiddleware';
import {
  isAdminOrUid2SupportCheck,
  isSuperUserCheck,
  isUid2SupportCheck,
} from '../middleware/userRoleMiddleware';
import { enrichCurrentUser } from '../middleware/usersMiddleware';
import { createBusinessContactsRouter } from './businessContactsRouter';
import {
  handleCompleteRecommendations,
  handleGetAllParticipants,
  handleGetParticipant,
  handleGetParticipantVisibility,
  handleUpdateParticipant,
  handleUpdatePrimaryContact,
} from './participantHandlers/participants';
import {
  handleAddApiKey,
  handleDeleteApiKey,
  handleGetParticipantApiKey,
  handleGetParticipantApiKeys,
  handleUpdateApiKey,
} from './participantHandlers/participantsApiKeys';
import { handleGetParticipantApiRoles } from './participantHandlers/participantsApiRoles';
import {
  handleGetParticipantAppNames,
  handleSetParticipantAppNames,
} from './participantHandlers/participantsAppIds';
import { handleGetParticipantAuditTrail } from './participantHandlers/participantsAuditTrail';
import { handleCreateParticipant } from './participantHandlers/participantsCreation';
import {
  handleGetParticipantDomainNames,
  handleSetParticipantDomainNames,
} from './participantHandlers/participantsDomainNames';
import {
  handleAddKeyPair,
  handleDeleteKeyPair,
  handleGetParticipantKeyPairs,
  handleUpdateKeyPair,
} from './participantHandlers/participantsKeyPairs';
import {
  handleAddSharingPermission,
  handleGetSharingPermission,
  handleRemoveSharingPermission,
  handleUpdateSharingTypes,
} from './participantHandlers/participantsSharingPermissions';
import { handleGetSignedParticipants } from './participantHandlers/participantsSigned';
import {
  handleGetParticipantUsers,
  handleInviteUserToParticipant,
} from './participantHandlers/participantsUsers';
import { createParticipantUsersRouter } from './participantUsersRouter';

export function createParticipantsRouter() {
  const participantsRouter = express.Router();

  participantsRouter.get('/signed', handleGetSignedParticipants);

  participantsRouter.get('/allParticipants', isUid2SupportCheck, handleGetAllParticipants);

  participantsRouter.put('/', handleCreateParticipant);

  participantsRouter.use('/:participantId', verifyAndEnrichParticipant, enrichCurrentUser);

  participantsRouter.get('/:participantId', handleGetParticipant);
  participantsRouter.get('/:participantId/visibility', handleGetParticipantVisibility);
  participantsRouter.get('/:participantId/apiRoles', handleGetParticipantApiRoles);
  participantsRouter.put('/:participantId', isUid2SupportCheck, handleUpdateParticipant);
  participantsRouter.put('/:participantId/completeRecommendations', handleCompleteRecommendations);
  participantsRouter.put(
    '/:participantId/primaryContact',
    isAdminOrUid2SupportCheck,
    handleUpdatePrimaryContact
  );

  participantsRouter.post(
    '/:participantId/invite',
    isAdminOrUid2SupportCheck,
    handleInviteUserToParticipant
  );
  participantsRouter.get(
    '/:participantId/auditTrail',
    isAdminOrUid2SupportCheck,
    handleGetParticipantAuditTrail
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
