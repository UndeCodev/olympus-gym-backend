import { AppError } from '../../../core/errors/AppError';
import { APP_ORIGIN } from '../../../shared/config/env';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';
import { getPasswordResetTemplate } from '../templates/passwordReset.template';
import { sendEmail } from './sendEmail.service';

export const requestPasswordResetService = async (email: string) => {
  const user = await AuthModel.findUserByEmail(email);

  if (!user) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'El correo electrónico no está registrado',
    });
  }

  const passwordResetToken = tokenService.generateVerificationToken(user.id);

  const url = `${APP_ORIGIN}/autenticacion/restablecer-contrasena/${passwordResetToken}`;

  await sendEmail({ to: user.email, ...getPasswordResetTemplate(url) });
};
