import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { changePasswordSchema, updateProfileSchema } from '../schemas/profile.schema';
import { updateProfileService } from '../services/update-profile.service';
import { changePasswordService } from '../../auth/services/changePassword.service';
import { NODE_ENV } from '../../../shared/config/env';

export class ProfileController {
  static async updateProfile(req: Request, res: Response) {
    const userId = Number(res.locals.user);
    const { firstName, lastName, phoneNumber, email } = await validateSchema(updateProfileSchema, req.body);

    const profileUpdated = await updateProfileService(userId, { firstName, lastName, phoneNumber, email });

    res.json(profileUpdated);
  }

  static async changePassword(req: Request, res: Response) {
    const userId = Number(res.locals.user);
    const { oldPassword, newPassword } = await validateSchema(changePasswordSchema, req.body);

    await changePasswordService(userId, oldPassword, newPassword);

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: NODE_ENV === 'production' });
    res.json({ message: 'Contraseña cambiada correctamente' });
  }
}
