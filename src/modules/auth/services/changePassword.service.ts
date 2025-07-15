import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';

export const changePasswordService = async (userId: number, oldPassword: string, newPassword: string) => {
  await AuthModel.changePassword(userId, oldPassword, newPassword);

  await tokenService.deleteRefreshToken(userId);
};
