import express from 'express';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { Participant, ParticipantStatus } from '../entities/Participant';
import { ParticipantType } from '../entities/ParticipantType';
import { UserRole } from '../entities/User';
import { getLoggers, getTraceId } from '../helpers/loggingHelpers';
import { mapClientTypeToParticipantType } from '../helpers/siteConvertingHelpers';
import { getKcAdminClient } from '../keycloakAdminClient';
import { getSite, getSiteList } from '../services/adminServiceClient';
import {
  assignClientRoleToUser,
  deleteUserByEmail,
  queryUsersByEmail,
  sendInviteEmail,
  updateUserProfile,
} from '../services/kcUsersService';
import {
  enrichCurrentUser,
  enrichUserWithIsApprover,
  enrichWithUserFromParams,
  UserRequest,
} from '../services/usersService';

export function createUsersRouter() {
  const usersRouter = express.Router();
  usersRouter.use('/current', enrichCurrentUser);
  usersRouter.get('/current', async (req: UserRequest, res) => {
    const userWithIsApprover = await enrichUserWithIsApprover(req.user!);
    return res.json(userWithIsApprover);
  });

  usersRouter.put('/current/acceptTerms', async (req: UserRequest, res) => {
    if (!req.user?.participantId) {
      return res.status(403).json({
        message: 'Unauthorized. You do not have the necessary permissions.',
        errorHash: req.headers.traceId,
      });
    }

    const participant = await Participant.query().findById(req.user.participantId!);
    if (!participant || participant.status !== ParticipantStatus.Approved) {
      return res.status(403).json({
        message: 'Unauthorized. You do not have the necessary permissions.',
        errorHash: req.headers.traceId,
      });
    }

    const kcAdminClient = await getKcAdminClient();
    const promises = [
      req.user!.$query().patch({ acceptedTerms: true }),
      assignClientRoleToUser(kcAdminClient, req.user?.email!, 'api-participant-member'),
    ];
    await Promise.all(promises);
    return res.sendStatus(200);
  });

  usersRouter.get('/current/participant', async (req: UserRequest, res) => {
    const currentParticipant = await Participant.query().findOne({ id: req.user!.participantId });

    const currentSite =
      currentParticipant?.siteId === undefined
        ? undefined
        : await getSite(currentParticipant?.siteId);

    const allParticipantTypes = await ParticipantType.query();
    const result = {
      ...currentParticipant,
      types: mapClientTypeToParticipantType(currentSite?.clientTypes || [], allParticipantTypes),
    };
    return res.status(200).json(result);
  });

  usersRouter.use('/:userId', enrichWithUserFromParams);

  usersRouter.get('/:userId', async (req: UserRequest, res) => {
    return res.status(200).json(req.user);
  });

  usersRouter.post('/:userId/resendInvitation', async (req: UserRequest, res) => {
    const { infoLogger, errorLogger } = getLoggers();
    const traceId = getTraceId(req);
    const kcAdminClient = await getKcAdminClient();
    const user = await queryUsersByEmail(kcAdminClient, req.user?.email || '');

    const resultLength = user?.length ?? 0;
    if (resultLength < 1) {
      return res.sendStatus(404);
    }
    if (resultLength > 1) {
      errorLogger.error(
        `Multiple results received when loading user entry for ${req.user?.email}`,
        traceId
      );
      return res.sendStatus(500);
    }

    infoLogger.info(
      `Resending invitation email for ${req.user?.email}, keycloak ID ${user[0].id}`,
      traceId
    );
    await sendInviteEmail(kcAdminClient, user[0]);
    return res.sendStatus(200);
  });

  type DeletedUser = {
    email: string;
    participantId: number | null;
    deleted: boolean;
  };

  usersRouter.delete('/:userId', async (req: UserRequest, res) => {
    const { user } = req;
    if (req.auth?.payload?.email === user?.email) {
      return res.status(403).send([{ message: 'You do not have permission to delete yourself.' }]);
    }
    const kcAdminClient = await getKcAdminClient();
    const data: DeletedUser = {
      email: `${user?.email}-removed-${uuid()}`,
      participantId: null,
      deleted: true,
    };
    await Promise.all([
      deleteUserByEmail(kcAdminClient!, user?.email!),
      user!.$query().patch(data),
    ]);

    return res.sendStatus(200);
  });

  const UpdateUserParser = z.object({
    firstName: z.string(),
    lastName: z.string(),
    role: z.nativeEnum(UserRole),
  });

  usersRouter.patch('/:userId', async (req: UserRequest, res) => {
    const { user } = req;
    const data = UpdateUserParser.parse(req.body);
    const kcAdminClient = await getKcAdminClient();
    await Promise.all([
      updateUserProfile(kcAdminClient, user?.email!, {
        firstName: data.firstName,
        lastName: data.lastName,
      }),
      user!.$query().patch(data),
    ]);
    return res.sendStatus(200);
  });

  return usersRouter;
}
