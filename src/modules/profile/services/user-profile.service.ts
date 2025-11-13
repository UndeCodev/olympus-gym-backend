import { AppError } from '../../../core/errors/AppError';
import { ProfileModel } from '../models/profile.model';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { AllowedFolders, uploadImageToCloudinary } from '../../../shared/utils/uploadImageToCloudinary';

interface UploadProfilePictureData {
  userId: number;
  profilePicture: Express.Multer.File;
}

export const uploadProfilePictureService = async (data: UploadProfilePictureData) => {
  const { userId, profilePicture } = data;

  // 1. Verificar que el usuario existe
  const existingUser = await ProfileModel.getUserById(userId);
  
  if (!existingUser) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Usuario no encontrado'
    });
  }

  // 2. Si ya tiene foto de perfil, eliminar la anterior de Cloudinary

  // 3. Subir nueva imagen a Cloudinary
  const { publicId, url } = await uploadImageToCloudinary(
    profilePicture, 
    'user-profiles' as AllowedFolders
  );

  // 4. Actualizar usuario en base de datos
  await ProfileModel.updateProfilePicture({
    userId,
    profilePictureUrl: url,
    publicId
  });

  return {
    success: true,
    message: 'Foto de perfil actualizada exitosamente',
    profilePictureUrl: url
  };
};