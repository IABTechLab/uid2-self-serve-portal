import { createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 587,
  secure: true,
  auth: {
    user: 'YOUR_GMAIL',
    pass: 'YOUR_APPLICATION_PASSWORD',
  },
});
