import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { EmailContact } from '../entities/EmailContact';
import { Participant } from '../entities/Participant';

export interface EmailContactRequest extends Request {
  participant?: Participant;
  emailContact?: EmailContact;
}

//

const contactIdSchema = z.object({
  contactId: z.string(),
});

export const hasEmailContactAccess = async (
  req: EmailContactRequest,
  res: Response,
  next: NextFunction
) => {
  const { participant } = req;
  const { contactId } = contactIdSchema.parse(req.params);
  const emailContact = await EmailContact.query().findById(contactId);

  if (!emailContact) {
    return res.status(404).send([{ message: 'The email contact cannot be found.' }]);
  }

  if (emailContact.participantId !== participant!.id) {
    return res.status(403).send([{ message: 'You do not have permission to that email contact.' }]);
  }

  req.emailContact = emailContact;
  return next();
};
