import { JwtPayload } from '../../../shared/interfaces/JwtPayload';
import { tokenService } from '../../../shared/services/tokens.service';
import { AuthModel } from '../models/auth.model';

export const loginService = async (email: string, password: string) => {
  const user = await AuthModel.login(email, password);

  const payload: JwtPayload = { id: user.id, rol: user.rol };

  if (user.rol == 'MEMBER' && user.difficultyLevelid) {
    payload.difficultyLevelId = user.difficultyLevelid;
  }
  const accessToken = tokenService.generateAccessToken(payload);
  const newRefreshToken = tokenService.generateRefreshToken(payload);

  await tokenService.storeRefreshToken(newRefreshToken, user.id);

  return { accessToken, newRefreshToken, user };
};
