import sgMail from '@sendgrid/mail';

import { SSP_SEND_GRID_API_KEY } from '../envars';
import _templateIdMapping from '../templateIdMapping.json';
import { EmailArgs, UID2Sender } from './emailTypes';

type TemplateIdMapping = {
  [key: string]: string;
};
const templateIdMapping = _templateIdMapping as TemplateIdMapping;

sgMail.setApiKey(SSP_SEND_GRID_API_KEY);

const findTemplate = (template: string): string => {
  if (template in templateIdMapping) {
    return templateIdMapping[template];
  }
  throw Error('template not exist');
};

export const sendEmail = async ({ to, subject, templateData, template }: EmailArgs) => {
  if (SSP_SEND_GRID_API_KEY === '') {
    throw new Error('Missing environment variable SSP_SEND_GRID_API_KEY');
  }
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
  return sgMail.send(message);
};
