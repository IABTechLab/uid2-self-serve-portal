import { SSP_WEB_BASE_URL } from '../envars';
import { EmailArgs } from './emailTypes';
import * as NodemailerService from './nodemailerService';
import * as SendGridService from './sendGridService';

export function createEmailService() {
  const isProduction = process.env.NODE_ENV === 'production';

  async function sendEmail(args: EmailArgs): Promise<void> {
    const emailArgs = {
      ...args,
      templateData: {
        ...args.templateData,
        baseUrl: SSP_WEB_BASE_URL,
      },
    };
    if (isProduction) {
      await SendGridService.sendEmail(emailArgs);
    } else {
      await NodemailerService.sendEmail(emailArgs);
    }
  }

  return { sendEmail };
}
