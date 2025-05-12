import { Response } from 'express';
import { z } from 'zod';

import { getRoleNamesByIds } from '../../../web/utils/apiRoles';
import { ApiRole } from '../../entities/ApiRole';
import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import { Participant } from '../../entities/Participant';
import { User, UserCreationPartial } from '../../entities/User';
import { UserRoleId } from '../../entities/UserRole';
import { UserToParticipantRole } from '../../entities/UserToParticipantRole';
import { getTraceId, TraceId } from '../../helpers/loggingHelpers';
import { getKcAdminClient } from '../../keycloakAdminClient';
import { addSite, getSiteList, setSiteClientTypes } from '../../services/adminServiceClient';
import {
  mapClientTypeIdsToAdminEnums,
  mapClientTypesToAdminEnums,
  SiteCreationRequest,
} from '../../services/adminServiceHelpers';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import { doesUserExistInKeycloak } from '../../services/kcUsersService';
import { getParticipantTypesByIds, ParticipantRequest } from '../../services/participantsService';
import {
  createAndInviteKeycloakUser,
  findUserByEmail,
  sendInviteEmailToExistingUser,
} from '../../services/usersService';
import {
  ParticipantCreationAndApprovalPartial,
  ParticipantCreationRequest,
} from './participantClasses';

export async function validateParticipantCreationRequest(
  participantRequest: z.infer<typeof ParticipantCreationRequest>,
  traceId: TraceId
) {
  const existingParticipant = await Participant.query().findOne(
    'name',
    participantRequest.participantName
  );
  if (existingParticipant) {
    return 'Duplicate participant name';
  }
  if (!participantRequest.siteId) {
    // check for duplicate site in admin
    const { siteName } = participantRequest;
    // this is inefficient but we'd need a new endpoint in admin to search by name
    const sites = await getSiteList(traceId);
    if (sites.filter((site) => site.name === siteName).length > 0) {
      return 'Requested site name already exists';
    }
  }
  return null;
}

const createParticipantWithUser = async (
  parsedUser: z.infer<typeof UserCreationPartial>,
  participantData: z.infer<typeof ParticipantCreationAndApprovalPartial>
): Promise<Participant | undefined> => {
  const participant = await User.transaction(async (trx) => {
    let user = await findUserByEmail(parsedUser.email);
    if (!user) {
      user = await User.query(trx).insertAndFetch(parsedUser);
    }

    // create participant
    const newParticipant = await Participant.query(trx)
      .insertGraphAndFetch([participantData], {
        relate: true,
      })
      .first();

    // update user/participant/role mapping
    await UserToParticipantRole.query(trx).insert({
      userId: user.id,
      participantId: newParticipant?.id!,
      userRoleId: UserRoleId.Admin,
    });
    return newParticipant;
  });
  return participant;
};

async function createParticipant(
  requestorEmail: string,
  participantRequest: z.infer<typeof ParticipantCreationRequest>,
  user: z.infer<typeof UserCreationPartial>,
  traceId: TraceId
) {
  const types = await getParticipantTypesByIds(participantRequest.participantTypes);

  let site;
  if (!participantRequest.siteId) {
    // new site.  Create it in admin
    const adminSiteTypes = mapClientTypesToAdminEnums(types).join(',');
    const newSite = SiteCreationRequest.parse({
      name: participantRequest.siteName,
      description: '',
      types: adminSiteTypes,
    });
    site = await addSite(newSite.name, newSite.description, newSite.types, traceId);
  } else {
    // existing site.  Update client types
    setSiteClientTypes({ siteId: participantRequest.siteId, types }, traceId);
  }
  const apiRoles = await ApiRole.query().findByIds(participantRequest.apiRoles);
  const parsedParticipantRequest = ParticipantCreationAndApprovalPartial.parse({
    name: participantRequest.participantName,
    types,
    apiRoles,
    siteId: participantRequest.siteId ?? site?.id,
    crmAgreementNumber: participantRequest.crmAgreementNumber,
  });

  const requestingUser = await findUserByEmail(requestorEmail);
  const auditTrailInsertObject = constructAuditTrailObject(
    requestingUser!,
    AuditTrailEvents.ManageParticipant,
    {
      action: AuditAction.Add,
      siteId: parsedParticipantRequest.siteId!,
      apiRoles: getRoleNamesByIds(parsedParticipantRequest.apiRoles.map((role) => role.id)),
      participantName: parsedParticipantRequest.name,
      participantTypes: mapClientTypeIdsToAdminEnums(
        parsedParticipantRequest.types.map((type) => type.id)
      ),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      jobFunction: user.jobFunction,
      crmAgreementNumber: parsedParticipantRequest.crmAgreementNumber,
    }
  );

  await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
    const participantData = {
      ...parsedParticipantRequest,
      approverId: requestingUser?.id,
      dateApproved: new Date(),
    };

    const newParticipant = await createParticipantWithUser(user, participantData);

    const kcAdminClient = await getKcAdminClient();
    const isExistingKcUser = await doesUserExistInKeycloak(kcAdminClient, user.email);
    if (!isExistingKcUser) {
      await createAndInviteKeycloakUser(user.firstName, user.lastName, user.email);
    } else {
      const existingPortalUser = await findUserByEmail(user.email);
      sendInviteEmailToExistingUser(newParticipant!.name, existingPortalUser!, traceId);
    }
  });
}

export async function handleCreateParticipant(req: ParticipantRequest, res: Response) {
  const participantRequest = ParticipantCreationRequest.parse(req.body);
  const traceId = getTraceId(req);

  const validationError = await validateParticipantCreationRequest(participantRequest, traceId);
  if (validationError) {
    return res.status(400).send(validationError);
  }
  const userRequest = UserCreationPartial.parse({
    ...req.body,
    acceptedTerms: false,
  });
  const requestorEmail = req.auth?.payload?.email as string;
  await createParticipant(requestorEmail, participantRequest, userRequest, traceId);

  return res.sendStatus(200);
}
