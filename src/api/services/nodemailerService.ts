import nodemailer from 'nodemailer';
import { Address } from 'nodemailer/lib/mailer';
import hbs from 'nodemailer-express-handlebars';

import { EmailArgs, EmailData, UID2Sender } from './emailTypes';

const transporter = nodemailer.createTransport({
  port: 18025,
});

transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',
      layoutsDir: 'emailTemplates/',
    },
    viewPath: 'emailTemplates/',
    extName: '.hbs',
  })
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
    to: convertEmailDataToAddress(to),
    subject,
    template,
    context: templateData,
  };

  await transporter.sendMail(mailOptions);
};
