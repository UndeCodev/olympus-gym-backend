import nodemailer from 'nodemailer';
import { NODEMAILER_PASS, NODEMAILER_USER } from './env';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
});

export default transporter;
