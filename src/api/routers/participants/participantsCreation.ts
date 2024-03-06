import { Response } from 'express';

import { ApiRole } from '../../entities/ApiRole';
import { Participant, ParticipantStatus } from '../../entities/Participant';
import { ParticipantType } from '../../entities/ParticipantType';
import { User, UserCreationPartial } from '../../entities/User';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getKcAdminClient } from '../../keycloakAdminClient';
import { addSite, getSiteList } from '../../services/adminServiceClient';
import {
  mapClientTypesToAdminEnums,
  SiteCreationRequest,
} from '../../services/adminServiceHelpers';
import {
  insertAddParticipantAuditTrail,
  updateAuditTrailToProceed,
} from '../../services/auditTrailService';
import {
  assignClientRoleToUser,
  createNewUser,
  sendInviteEmail,
} from '../../services/kcUsersService';
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

  if (!participantRequest.siteId) {
    // check for duplicate site in admin
    const { siteName } = participantRequest;
    // this is inefficient but we'd need a new endpoint in admin to search by name
    const sites = await getSiteList();
    if (sites.filter((site) => site.name === siteName).length > 0) {
      return res.status(400).send('Requested site name already exists');
    }
  }

  const traceId = getTraceId(req);
  const requestingUser = await findUserByEmail(req.auth?.payload?.email as string);
  const user = UserCreationPartial.parse({
    ...req.body,
    acceptedTerms: true,
  });

  const types = await ParticipantType.query().findByIds(participantRequest.participantTypes);
  const apiRoles = await ApiRole.query().findByIds(participantRequest.apiRoles);

  let site;
  if (!participantRequest.siteId) {
    // create site (UID2-2631)
    const adminSiteTypes = mapClientTypesToAdminEnums(types).join(',');
    const newSite = SiteCreationRequest.parse({
      name: participantRequest.siteName,
      description: '',
      types: adminSiteTypes,
    });
    site = await addSite(newSite.name, newSite.description, newSite.types);
  }

  const participantData = ParticipantCreationAndApprovalPartial.parse({
    name: participantRequest.participantName,
    types,
    apiRoles,
    status: ParticipantStatus.Approved,
    siteId: participantRequest.siteId ?? site?.id,
    users: [user],
  });

  const auditTrail = await insertAddParticipantAuditTrail(requestingUser!.email, participantData);

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

  // assign proper api access
  assignClientRoleToUser(kcAdminClient, newUser.email, 'api-participant-member');

  await sendInviteEmail(kcAdminClient, newKcUser);
  await sendParticipantApprovedEmail([newUser!], traceId);
  await updateAuditTrailToProceed(auditTrail.id);

  return res.sendStatus(200);
}
