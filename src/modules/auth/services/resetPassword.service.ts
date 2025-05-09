import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';

export const resetPasswordService = async (token: string, password: string, newPassword: string) => {
  const { id } = tokenService.verifyToken(token);

  await AuthModel.resetPassword(id, password, newPassword);

  tokenService.deleteRefreshToken(id);
};
