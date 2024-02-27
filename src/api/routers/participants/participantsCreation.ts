import { Response } from 'express';

import { ApiRole } from '../../entities/ApiRole';
import { Participant, ParticipantStatus } from '../../entities/Participant';
import { ParticipantType } from '../../entities/ParticipantType';
import { User, UserCreationPartial } from '../../entities/User';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getKcAdminClient } from '../../keycloakAdminClient';
import {
  insertAddParticipantAuditTrail,
  updateAuditTrailToProceed,
} from '../../services/auditTrailService';
import { createNewUser, sendInviteEmail } from '../../services/kcUsersService';
import {
  ParticipantRequest,
  sendParticipantApprovedEmail,
} from '../../services/participantsService';
import { findUserByEmail } from '../../services/usersService';
import {
  ParticipantCreationAndApprovalPartial,
  ParticipantCreationRequest,
} from './participantClasses';

export async function createParticipant(req: ParticipantRequest, res: Response) {
  const participantRequest = ParticipantCreationRequest.parse(req.body);
  const existingParticipant = await Participant.query().findOne(
    'name',
    participantRequest.participantName
  );
  if (existingParticipant) {
    return res.status(400).send('Duplicate participant name');
  }
  const existingUser = await findUserByEmail(participantRequest.email);
  if (existingUser) {
    return res.status(400).send('Duplicate requesting user');
  }
  const kcAdminClient = await getKcAdminClient();
  const existingKcUser = await kcAdminClient.users.find({ email: participantRequest.email });
  if (existingKcUser.length > 0) {
    return res.status(400).send('Requesting user already exists in Keycloak');
  }

  const traceId = getTraceId(req);
  const requestingUser = await findUserByEmail(req.auth?.payload?.email as string);
  const user = UserCreationPartial.parse({
    ...req.body,
    acceptedTerms: true,
  });

  const types = await ParticipantType.query().findByIds(participantRequest.participantTypes);
  const apiRoles = await ApiRole.query().findByIds(participantRequest.apiRoles);

  const participantData = ParticipantCreationAndApprovalPartial.parse({
    name: participantRequest.participantName,
    types,
    apiRoles,
    status: ParticipantStatus.Approved,
    siteId: participantRequest.siteId,
    users: [user],
  });

  const auditTrail = await insertAddParticipantAuditTrail(requestingUser!.email, participantData);

  // create site (UID2-2631)

  // create participant, user, and role/type mappings
  await Participant.query().insertGraphAndFetch([participantData], {
    relate: true,
  });

  // Get newly created user
  const newUser = (await User.query().findOne('email', participantRequest.email)) as User;

  // create keyCloak user
  const newKcUser = await createNewUser(
    kcAdminClient,
    participantRequest.firstName,
    participantRequest.lastName,
    participantRequest.email
  );

  await sendInviteEmail(kcAdminClient, newKcUser);
  await sendParticipantApprovedEmail([newUser!], traceId);
  await updateAuditTrailToProceed(auditTrail.id);

  return res.sendStatus(200);
}