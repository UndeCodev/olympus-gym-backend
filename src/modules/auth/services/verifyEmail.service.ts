import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';

export const verifyEmailService = async (token: string) => {
  if (!token) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'No token provided',
    });
  }

  const { id } = tokenService.verifyToken(token);

  await AuthModel.verifyEmail(id);
};
