import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';

export const changePasswordService = async (userId: number, password: string) => {
  await AuthModel.resetPassword(userId, password);

  await tokenService.deleteRefreshToken(userId);
};
