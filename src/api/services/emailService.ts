import { SSP_WEB_BASE_URL } from '../envars';
import { getLoggers, TraceId } from '../helpers/loggingHelpers';
import { isEuid } from '../identity';
import { EmailArgs } from './emailTypes';
import * as NodemailerService from './nodemailerService';
import * as SendGridService from './sendGridService';

export type EmailSendResult = void | { status: 'skipped'; reason: string };

export function createEmailService() {
  const isProduction = process.env.NODE_ENV === 'production';

  async function sendEmail(args: EmailArgs, traceId: TraceId): Promise<EmailSendResult> {
    if (isEuid()) {
      const { infoLogger } = getLoggers();
      infoLogger.info(
        `Skipping outbound email under EUID MVP (template=${args.template}, subject=${args.subject})`,
        traceId
      );
      return { status: 'skipped', reason: 'EUID MVP — no outbound email' };
    }

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
    return undefined;
  }

  return { sendEmail };
}
