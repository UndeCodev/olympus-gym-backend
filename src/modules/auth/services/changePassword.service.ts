import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';

export const changePasswordService = async (userId: number, password: string, newPassword: string) => {
  await AuthModel.resetPassword(userId, password, newPassword);

  await tokenService.deleteRefreshToken(userId);
};
