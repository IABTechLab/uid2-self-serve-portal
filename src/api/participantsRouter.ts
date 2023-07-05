import express, { Response } from 'express';
import { z } from 'zod';

import { Participant, ParticipantCreationPartial, ParticipantSchema } from './entities/Participant';
import { SharingAction } from './entities/SharingAuditTrail';
import { UserRole } from './entities/User';
import { getKcAdminClient } from './keycloakAdminClient';
import { createNewUser, sendInviteEmail } from './services/kcUsersService';
import {
  addSharingParticipants,
  deleteSharingParticipants,
  enrichCurrentParticipant,
  getSharingParticipants,
  hasParticipantAccess,
  ParticipantRequest,
  sendNewParticipantEmail,
} from './services/participantsService';
import {
  insertSharingAuditTrails,
  updateAuditTrailsToProceed,
} from './services/sharingAuditTrailService';
import { createUserInPortal, findUserByEmail } from './services/usersService';

export const participantsRouter = express.Router();

participantsRouter.get('/available', async (_req, res) => {
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

    sendNewParticipantEmail(
      data,
      data.types.map((t) => t.id)
    );
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
      const { participant } = req;
      const { firstName, lastName, email, role } = invitationParser.parse(req.body);
      const kcAdminClient = await getKcAdminClient();
      const user = await createNewUser(kcAdminClient, firstName, lastName, email);
      await createUserInPortal({
        email,
        role,
        participantId: participant!.id,
        firstName,
        lastName,
      });
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
    const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
    const auditTrails = await insertSharingAuditTrails(
      participant.id,
      currentUser!.id,
      currentUser!.email,
      SharingAction.Add,
      newParticipantSites
    );

    const sharingParticipants = await addSharingParticipants(
      participant.siteId,
      newParticipantSites
    );

    await updateAuditTrailsToProceed(auditTrails.map((a) => a.id));
    return res.status(200).json(sharingParticipants);
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
    const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
    const auditTrails = await insertSharingAuditTrails(
      participant.id,
      currentUser!.id,
      currentUser!.email,
      SharingAction.Delete,
      sharingSitesToRemove
    );

    const sharingParticipants = await deleteSharingParticipants(
      participant.siteId,
      sharingSitesToRemove
    );

    await updateAuditTrailsToProceed(auditTrails.map((a) => a.id));

    return res.status(200).json(sharingParticipants);
  }
);

const currentParticipantRoute = express.Router();
participantsRouter.use('/current', enrichCurrentParticipant, currentParticipantRoute);
