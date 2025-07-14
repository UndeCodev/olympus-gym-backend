import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';

export const resetPasswordService = async (token: string, newPassword: string) => {
  const { id } = tokenService.verifyToken(token);

  await AuthModel.resetPassword(id, newPassword);

  await tokenService.deleteRefreshToken(id);
};
