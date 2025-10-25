import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';

export const loginService = async (email: string, password: string) => {
  const user = await AuthModel.login(email, password);

  const payload = { id: user.id, rol: user.rol };

  const accessToken = tokenService.generateAccessToken(payload);
  const newRefreshToken = tokenService.generateRefreshToken(payload);

  await tokenService.storeRefreshToken(newRefreshToken, user.id);

  return { accessToken, newRefreshToken, user };
};
