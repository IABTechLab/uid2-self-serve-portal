import { EmailArgs } from './emailTypes';
import * as NodemailerService from './nodemailerService';
import * as SendGridService from './sendGridService';

export function createEmailService() {
  const isProduction = process.env.NODE_ENV === 'production';

  async function sendEmail(args: EmailArgs): Promise<void> {
    if (isProduction) {
      await SendGridService.sendEmail(args);
    } else {
      await NodemailerService.sendEmail(args);
    }
  }

  return { sendEmail };
}
