import { User } from '../../../core/entities/User';
import { APP_ORIGIN } from '../../../shared/config/env';
import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';
import { getVerifyEmailTemplate } from '../templates/verifyEmail.template';
import { sendEmail } from './sendEmail.service';

export const createAccountService = async (user: User) => {
  const { id: userId } = await AuthModel.createUser(user);

  const verificationToken = tokenService.generateVerificationToken(userId);

  const url = `${APP_ORIGIN}/auth/verify-email/${verificationToken}`;

  await sendEmail({ to: user.email, ...getVerifyEmailTemplate(url) });
};
