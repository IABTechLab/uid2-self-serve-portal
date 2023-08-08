import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { BusinessContact } from '../entities/BusinessContact';
import { Participant } from '../entities/Participant';

export interface BusinessContactRequest extends Request {
  participant: Participant;
  businessContact: BusinessContact;
}

const contactIdParser = z.object({
  contactId: z.string(),
});

export const hasBusinessContactAccess = async (
  req: BusinessContactRequest,
  res: Response,
  next: NextFunction
) => {
  const { participant } = req;
  const { contactId } = contactIdParser.parse(req.params);
  const businessContact = await BusinessContact.query().findById(contactId);

  if (!businessContact) {
    return res.status(404).send([{ message: 'The business contact cannot be found.' }]);
  }

  if (businessContact.participantId !== participant!.id) {
    return res
      .status(403)
      .send([{ message: 'You do not have permission to that business contact.' }]);
  }

  req.businessContact = businessContact;
  return next();
};
