import transporter from '../../../shared/config/nodemailer';

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendEmail = async ({ to, subject, text, html }: Params) => {
  await transporter.sendMail({ to, subject, text, html });
};
