import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { Participant, ParticipantCreationPartial, ParticipantSchema } from './entities/Participant';
import { ParticipantType } from './entities/ParticipantType';
import { SharingAction } from './entities/SharingAuditTrail';
import { UserRole } from './entities/User';
import { getKcAdminClient } from './keycloakAdminClient';
import { createNewUser, sendInviteEmail } from './services/kcUsersService';
import {
  addSharingParticipants,
  deleteSharingParticipants,
  getSharingParticipants,
  sendNewParticipantEmail,
} from './services/participantsService';
import { insertSharingAuditTrails } from './services/sharingAuditTrailService';
import {
  createUserInPortal,
  findUserByEmail,
  isUserBelongsToParticipant,
} from './services/usersService';

export const participantsRouter = express.Router();

const idParser = z.object({
  participantId: z.coerce.number(),
});

export interface ParticipantRequest extends Request {
  participant?: Participant;
}

export const hasParticipantAccess = async (
  req: ParticipantRequest,
  res: Response,
  next: NextFunction
) => {
  const { participantId } = idParser.parse(req.params);
  const participant = await Participant.query().findById(participantId);
  if (!participant) {
    return res.status(404).send([{ message: 'The participant cannot be found.' }]);
  }

  if (!(await isUserBelongsToParticipant(req.auth?.payload?.email as string, participantId))) {
    return res.status(403).send([{ message: 'You do not have permission to update participant.' }]);
  }

  req.participant = participant;
  return next();
};

participantsRouter.get('/', async (_req, res) => {
  const participants = await Participant.query().whereNotNull('siteId').withGraphFetched('types');
  return res.status(200).json(participants);
});

participantsRouter.post('/', async (req, res) => {
  try {
    const data = ParticipantCreationPartial.parse(req.body);
    // insertGraphAndFetch will implicitly create a transaction
    const newParticipant = await Participant.query().insertGraphAndFetch([data], {
      relate: true,
    });

    const participantTypes = await ParticipantType.query().findByIds(data.types!.map((t) => t.id));
    sendNewParticipantEmail(data, participantTypes);
    return res.status(201).json(newParticipant);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(err.issues);
    }
    return res.status(400).send([{ message: 'Unable to create participant' }]);
  }
});

const invitationParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.nativeEnum(UserRole),
});

participantsRouter.post(
  '/:participantId/invite',
  hasParticipantAccess,
  async (req: ParticipantRequest, res: Response) => {
    try {
      const { participantId } = idParser.parse(req.params);
      const { firstName, lastName, email, role } = invitationParser.parse(req.body);
      const kcAdminClient = await getKcAdminClient();
      const user = await createNewUser(kcAdminClient, firstName, lastName, email);
      await createUserInPortal({ email, role, participantId, firstName, lastName });
      await sendInviteEmail(kcAdminClient, user);
      return res.sendStatus(201);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).send(err.issues);
      }
      throw err;
    }
  }
);

const participantParser = ParticipantSchema.pick({
  location: true,
});
participantsRouter.put(
  '/:participantId',
  hasParticipantAccess,
  async (req: ParticipantRequest, res: Response) => {
    try {
      const { location } = participantParser.parse(req.body);

      const { participant } = req;
      await participant!.$query().patch({ location });
      return res.status(200).json(participant);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).send(err.issues);
      }
      throw err;
    }
  }
);

participantsRouter.get(
  '/:participantId/sharingPermission',
  hasParticipantAccess,
  async (req: ParticipantRequest, res: Response) => {
    const { participant } = req;
    if (!participant?.siteId) {
      return res.status(400).send('Site id is not set');
    }
    const sharingParticipants = await getSharingParticipants(participant.siteId);
    return res.status(200).json(sharingParticipants);
  }
);

const sharingRelationParser = z.object({
  newParticipantSites: z.array(z.number()),
});

participantsRouter.post(
  '/:participantId/sharingPermission/add',
  hasParticipantAccess,
  async (req: ParticipantRequest, res: Response) => {
    const { participant } = req;
    if (!participant?.siteId) {
      return res.status(400).send('Site id is not set');
    }
    const { newParticipantSites } = sharingRelationParser.parse(req.body);
    await addSharingParticipants(participant.siteId, newParticipantSites);

    const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
    await insertSharingAuditTrails(
      participant.id,
      currentUser!.id,
      SharingAction.Add,
      newParticipantSites
    );

    return res.status(200);
  }
);

const removeSharingRelationParser = z.object({
  sharingSitesToRemove: z.array(z.number()),
});

participantsRouter.post(
  '/:participantId/sharingPermission/delete',
  hasParticipantAccess,
  async (req: ParticipantRequest, res: Response) => {
    const { participant } = req;
    if (!participant?.siteId) {
      return res.status(400).send('Site id is not set');
    }
    const { sharingSitesToRemove } = removeSharingRelationParser.parse(req.body);
    await deleteSharingParticipants(participant.siteId, sharingSitesToRemove);

    const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
    await insertSharingAuditTrails(
      participant.id,
      currentUser!.id,
      SharingAction.Delete,
      sharingSitesToRemove
    );

    return res.status(200);
  }
);
