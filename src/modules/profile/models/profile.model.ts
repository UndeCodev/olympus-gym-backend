import { PrismaClient } from '../../../../generated/prisma';
import { PrismaClientKnownRequestError } from '../../../../generated/prisma/runtime/library';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { AuthModel } from '../../auth/models/auth.model';
import { UpdateProfilePictureData } from '../interfaces/profile-picture.interface';
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

  static async getUserById(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePictureUrl: true,
        profilePicturePublicId: true,
      },
    });
  }

  static async updateProfilePicture(data: UpdateProfilePictureData) {
    return await prisma.user.update({
      where: { id: data.userId },
      data: {
        profilePictureUrl: data.profilePictureUrl,
        profilePicturePublicId: data.publicId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePictureUrl: true,
      },
    });
  }
}
