import { SSP_EMAIL_SENDER, SSP_EMAIL_SENDER_NAME } from '../envars';

export type EmailData = string | { name?: string; email: string };

export type EmailArgs = {
  subject: string;
  templateData: { [key: string]: unknown };
  template: string;
  to: EmailData | EmailData[];
};

export const UID2Sender: EmailData = {
  name: SSP_EMAIL_SENDER_NAME,
  email: SSP_EMAIL_SENDER,
};
