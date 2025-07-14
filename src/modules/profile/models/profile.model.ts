import { PrismaClient } from '../../../../generated/prisma';
import { PrismaClientKnownRequestError } from '../../../../generated/prisma/runtime/library';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { AuthModel } from '../../auth/models/auth.model';
import { ProfileUpdateRequestInterface } from '../interfaces/profile-update-request.interface';

const prisma = new PrismaClient();

export class ProfileModel {
  static async updateProfile(userId: number, data: ProfileUpdateRequestInterface) {
    const { firstName, lastName, phoneNumber, email } = data;

    try {
      await prisma.user.updateMany({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          phoneNumber,
          email,
        },
      });

      const profileUpdated = await AuthModel.findUserByIdWithouSensitiveData(userId);

      return profileUpdated;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError({
          httpCode: HttpCode.CONFLICT,
          description: `El correo ${data.email} ya se encuentra registrado.`,
        });
      }
    }
  }
}
