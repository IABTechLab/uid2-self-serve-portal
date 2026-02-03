import express, { Response } from 'express';

import { EmailContact } from '../entities/EmailContact';
import { EmailContactSchema } from '../entities/Schemas';
import { isAdminOrUid2SupportCheck } from '../middleware/userRoleMiddleware';
import { EmailContactRequest, hasEmailContactAccess } from '../services/emailContactsService';
import { ParticipantRequest } from '../services/participantsService';

export const EmailContactsDTO = EmailContactSchema.pick({
  name: true,
  emailAlias: true,
  contactType: true,
});

const handleGetEmailContacts = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  const emailContacts = await EmailContact.query().where('participantId', participant?.id!);
  return res.status(200).json(emailContacts);
};

const handleCreateEmailContact = async (req: ParticipantRequest, res: Response) => {
  const data = EmailContactsDTO.parse(req.body);
  const { participant } = req;
  const newContact = await EmailContact.query()
    .where('participantId', participant?.id!)
    .insert({ ...data, participantId: participant?.id! });
  return res.status(201).json(newContact);
};

const handleDeleteEmailContact = async (req: EmailContactRequest, res: Response) => {
  const { emailContact } = req;
  await emailContact!.$query().delete();
  return res.sendStatus(200);
};

const handleUpdateEmailContact = async (req: EmailContactRequest, res: Response) => {
  const { emailContact } = req;
  const data = EmailContactsDTO.parse(req.body);
  await emailContact!.$query().patch(data);
  return res.sendStatus(200);
};

export function createEmailContactsRouter() {
  const emailContactsRouter = express.Router();

  emailContactsRouter.get('/', handleGetEmailContacts);
  emailContactsRouter.post('/', isAdminOrUid2SupportCheck, handleCreateEmailContact);

  emailContactsRouter.use('/:contactId', isAdminOrUid2SupportCheck, hasEmailContactAccess);
  emailContactsRouter.delete('/:contactId', isAdminOrUid2SupportCheck, handleDeleteEmailContact);
  emailContactsRouter.put('/:contactId', isAdminOrUid2SupportCheck, handleUpdateEmailContact);

  return emailContactsRouter;
}
