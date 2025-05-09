import { AppError } from '../../../core/errors/AppError';
import { APP_ORIGIN } from '../../../shared/config/env';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';
import { getVerifyEmailTemplate } from '../templates/verifyEmail.template';
import { sendEmail } from './sendEmail.service';

export const sendVerificationEmailService = async (email: string) => {
  const user = await AuthModel.findUserByEmail(email);

  if (!user) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'El correo electrónico no esta registrado',
    });
  }

  if (user.emailVerified) {
    throw new AppError({
      httpCode: HttpCode.CONFLIT,
      description: 'El correo electrónico ya ha sido verificado',
    });
  }

  const verificationToken = tokenService.generateVerificationToken(user.id);

  const url = `${APP_ORIGIN}/auth/verify-email/${verificationToken}`;

  await sendEmail({ to: user.email, ...getVerifyEmailTemplate(url) });
};
