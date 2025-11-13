import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { changePasswordSchema, updateProfileSchema, uploadProfilePictureSchema } from '../schemas/profile.schema';
import { updateProfileService } from '../services/update-profile.service';
import { changePasswordService } from '../../auth/services/changePassword.service';
import { NODE_ENV } from '../../../shared/config/env';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { uploadProfilePictureService } from '../services/user-profile.service';

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

  static async uploadProfilePicture(req: Request, res: Response) {
    const validatedData = await validateSchema(uploadProfilePictureSchema, req.body);
    const profilePicture = req.file;

    if (!profilePicture) {
      res.status(HttpCode.BAD_REQUEST).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
      return
    }

    const result = await uploadProfilePictureService({
      userId: validatedData.userId,
      profilePicture
    });

    res.status(HttpCode.OK).json(result);
  }
}
