import express, { Response } from 'express';

import { BusinessContact } from '../entities/BusinessContact';
import { BusinessContactSchema } from '../entities/Schemas';
import {
  BusinessContactRequest,
  hasBusinessContactAccess,
} from '../services/businessContactsService';
import { ParticipantRequest } from '../services/participantsService';

export const BusinessContactsDTO = BusinessContactSchema.pick({
  name: true,
  emailAlias: true,
  contactType: true,
});

// Handlers
const handleGetBusinessContacts = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  const businessContacts = await BusinessContact.query().where('participantId', participant?.id!);
  return res.status(200).json(businessContacts);
};

const handleCreateBusinessContact = async (req: ParticipantRequest, res: Response) => {
  const data = BusinessContactsDTO.parse(req.body);
  const { participant } = req;
  const newContact = await BusinessContact.query()
    .where('participantId', participant?.id!)
    .insert({ ...data, participantId: participant?.id! });
  return res.status(201).json(newContact);
};

const handleDeleteBusinessContact = async (req: BusinessContactRequest, res: Response) => {
  const { businessContact } = req;
  await businessContact!.$query().delete();
  return res.sendStatus(200);
};

const handleUpdateBusinessContact = async (req: BusinessContactRequest, res: Response) => {
  const { businessContact } = req;
  const data = BusinessContactsDTO.parse(req.body);
  await businessContact!.$query().patch(data);
  return res.sendStatus(200);
};

// Router
export function createBusinessContactsRouter() {
  const businessContactsRouter = express.Router();

  businessContactsRouter.get('/', handleGetBusinessContacts);
  businessContactsRouter.post('/', handleCreateBusinessContact);

  businessContactsRouter.use('/:contactId', hasBusinessContactAccess);
  businessContactsRouter.delete('/:contactId', handleDeleteBusinessContact);
  businessContactsRouter.put('/:contactId', handleUpdateBusinessContact);

  return businessContactsRouter;
}
