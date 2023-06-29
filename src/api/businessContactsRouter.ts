import express, { Response } from 'express';

import { BusinessContactsCreation } from './entities/BusinessContact';
import { ParticipantRequest } from './services/participantsService';

export const businessContactsRouter = express.Router();

businessContactsRouter.get('/', async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  const businessContacts = await participant!.$relatedQuery('businessContacts');
  return res.status(200).json(businessContacts);
});

businessContactsRouter.post('/', async (req: ParticipantRequest, res: Response) => {
  const data = BusinessContactsCreation.parse(req.body);
  const { participant } = req;
  const newContact = await participant!.$relatedQuery('businessContacts').insert(data);
  return res.status(200).json(newContact);
});
