import express, { Response } from 'express';
import { z } from 'zod';

import { BusinessContact, BusinessContactsDTO } from './entities/BusinessContact';
import { ParticipantRequest } from './services/participantsService';

export const businessContactsRouter = express.Router();

businessContactsRouter.get('/', async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  const businessContacts = await participant!.$relatedQuery('businessContacts');
  return res.status(200).json(businessContacts);
});

businessContactsRouter.post('/', async (req: ParticipantRequest, res: Response) => {
  const data = BusinessContactsDTO.parse(req.body);
  const { participant } = req;
  const newContact = await participant!.$relatedQuery('businessContacts').insert(data);
  return res.status(200).json(newContact);
});

const contactIdParser = z.object({
  contactId: z.string(),
});

businessContactsRouter.delete('/:contactId', async (req: ParticipantRequest, res: Response) => {
  const { contactId } = contactIdParser.parse(req.params);
  await BusinessContact.query().deleteById(contactId);
  return res.sendStatus(200);
});

businessContactsRouter.put('/:contactId', async (req: ParticipantRequest, res: Response) => {
  const { contactId } = contactIdParser.parse(req.params);
  const data = BusinessContactsDTO.parse(req.body);
  await BusinessContact.query().findById(contactId).patch(data);
  return res.sendStatus(200);
});
