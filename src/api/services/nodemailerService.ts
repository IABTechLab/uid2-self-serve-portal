import nodemailer from 'nodemailer';
import { Address } from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import hbs from 'nodemailer-express-handlebars';

import { EmailArgs, EmailData, UID2Sender } from './emailTypes';

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 11025,
} as SMTPTransport.Options);

transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',
      layoutsDir: 'emailTemplates/',
      defaultLayout: false,
    },
    viewPath: 'emailTemplates/',
    extName: '.hbs',
  } as hbs.NodemailerExpressHandlebarsOptions)
);

export const convertEmailDataToAddress = (emailData: EmailData): string | Address => {
  if (typeof emailData !== 'string') {
    return emailData.name ? { name: emailData.name, address: emailData.email } : emailData.email;
  }
  return emailData;
};

export const sendEmail = async ({
  to,
  subject,
  templateData,
  template,
}: EmailArgs): Promise<void> => {
  const mailOptions = {
    from: convertEmailDataToAddress(UID2Sender),
    to: Array.isArray(to) ? to.map(convertEmailDataToAddress) : convertEmailDataToAddress(to),
    subject,
    template,
    context: templateData,
  };
  await transporter.sendMail(mailOptions);
};
