import express, { Response } from 'express';

import { BusinessContactSchema } from './entities/BusinessContact';
import {
  BusinessContactRequest,
  hasBusinessContactAccess,
} from './services/businessContactsService';
import { ParticipantRequest } from './services/participantsService';

export const BusinessContactsDTO = BusinessContactSchema.pick({
  name: true,
  emailAlias: true,
  contactType: true,
});

export function createBusinessContactsRouter() {
  const businessContactsRouter = express.Router();

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

  businessContactsRouter.use('/:contactId', hasBusinessContactAccess);

  businessContactsRouter.delete(
    '/:contactId',
    async (req: BusinessContactRequest, res: Response) => {
      const { businessContact } = req;
      await businessContact!.$query().delete();
      return res.sendStatus(200);
    }
  );

  businessContactsRouter.put('/:contactId', async (req: BusinessContactRequest, res: Response) => {
    const { businessContact } = req;
    const data = BusinessContactsDTO.parse(req.body);
    await businessContact!.$query().patch(data);
    return res.sendStatus(200);
  });
  return businessContactsRouter;
}
