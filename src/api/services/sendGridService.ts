import sgMail from '@sendgrid/mail';

import { SSP_SEND_GRID_API_KEY } from '../envars';
import { getLoggers, TraceId } from '../helpers/loggingHelpers';
import { EmailArgs, UID2Sender } from './emailTypes';
import path from 'path';
import fs from 'fs';

type TemplateIdMapping = {
  [key: string]: string;
};
const jsonPath = path.resolve(new URL('.', import.meta.url).pathname, '../templateIdMapping.json');
const templateIdMapping = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as TemplateIdMapping;

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  if (SSP_SEND_GRID_API_KEY === '') {
    throw new Error('Missing environment variable SSP_SEND_GRID_API_KEY');
  }
  sgMail.setApiKey(SSP_SEND_GRID_API_KEY);
}

const findTemplate = (template: string): string => {
  if (template in templateIdMapping) {
    return templateIdMapping[template];
  }
  throw Error('template not exist');
};

export const sendEmail = async (
  { to, subject, templateData, template }: EmailArgs,
  traceId: TraceId
) => {
  const message = {
    from: UID2Sender,
    templateId: findTemplate(template),
    personalizations: [
      {
        to,
        // eslint-disable-next-line camelcase
        dynamic_template_data: {
          subject,
          ...templateData,
        },
      },
    ],
  };
  try {
    sgMail.send(message);
  } catch (err: unknown) {
    const { errorLogger } = getLoggers();

    errorLogger.error(`Send email failed: ${err}`, traceId);
  }
};
