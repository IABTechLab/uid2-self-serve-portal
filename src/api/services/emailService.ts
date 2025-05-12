import { SSP_WEB_BASE_URL } from '../envars';
import { TraceId } from '../helpers/loggingHelpers';
import { EmailArgs } from './emailTypes';
import * as NodemailerService from './nodemailerService';
import * as SendGridService from './sendGridService';

export function createEmailService() {
  const isProduction = process.env.NODE_ENV === 'production';

  async function sendEmail(args: EmailArgs, traceId: TraceId): Promise<void> {
    const emailArgs = {
      ...args,
      templateData: {
        ...args.templateData,
        baseUrl: SSP_WEB_BASE_URL,
      },
    };
    if (isProduction) {
      await SendGridService.sendEmail(emailArgs, traceId);
    } else {
      await NodemailerService.sendEmail(emailArgs);
    }
  }

  return { sendEmail };
}
