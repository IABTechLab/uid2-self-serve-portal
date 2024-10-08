import { Response } from 'express';
import { z } from 'zod';

import { ApiRole } from '../../entities/ApiRole';
import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import {
  Participant,
  ParticipantCreationPartial,
  ParticipantStatus,
} from '../../entities/Participant';
import { User, UserCreationPartial } from '../../entities/User';
import { UserRoleId } from '../../entities/UserRole';
import { UserToParticipantRole } from '../../entities/UserToParticipantRole';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getKcAdminClient } from '../../keycloakAdminClient';
import { addSite, getSiteList, setSiteClientTypes } from '../../services/adminServiceClient';
import {
  mapClientTypesToAdminEnums,
  SiteCreationRequest,
} from '../../services/adminServiceHelpers';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import { doesUserExistInKeycloak } from '../../services/kcUsersService';
import {
  getParticipantTypesByIds,
  ParticipantRequest,
  sendNewParticipantEmail,
} from '../../services/participantsService';
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
  participantRequest: z.infer<typeof ParticipantCreationRequest>
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
    const sites = await getSiteList();
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
  traceId: string
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
    site = await addSite(newSite.name, newSite.description, newSite.types);
  } else {
    // existing site.  Update client types
    setSiteClientTypes({ siteId: participantRequest.siteId, types });
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
      apiRoles: parsedParticipantRequest.apiRoles.map((role) => role.id),
      participantName: parsedParticipantRequest.name,
      participantTypes: parsedParticipantRequest.types.map((type) => type.id),
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
      status: ParticipantStatus.Approved,
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

  const validationError = await validateParticipantCreationRequest(participantRequest);
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

export const handleCreateParticipantFromRequest = async (
  req: ParticipantRequest,
  res: Response
) => {
  try {
    const traceId = getTraceId(req);
    const parsedRequest = ParticipantCreationPartial.parse(req.body);
    const { users, ...rest } = parsedRequest;
    const participantData = {
      ...rest,
      status: ParticipantStatus.AwaitingApproval,
    };
    const user = {
      ...users![0],
      acceptedTerms: false,
    };

    const participant = await User.transaction(async (trx) => {
      // create user
      const newPortalUser = await User.query(trx).insertAndFetch(user);

      // create participant
      const newParticipant = await Participant.query(trx)
        .insertGraphAndFetch([participantData], {
          relate: true,
        })
        .first();

      // update user/participant/role mapping
      await UserToParticipantRole.query(trx).insert({
        userId: newPortalUser.id,
        participantId: newParticipant?.id!,
        userRoleId: UserRoleId.Admin,
      });
      return newParticipant;
    });

    sendNewParticipantEmail(
      parsedRequest,
      parsedRequest.types.map((t) => t.id),
      traceId
    );
    return res.status(201).json(participant);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(err.issues);
    }
    return res.status(400).send([{ message: 'Unable to create participant' }]);
  }
};
