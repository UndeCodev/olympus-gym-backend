import { AppError } from '../../core/errors/AppError';
import { HttpCode } from '../interfaces/HttpCode';
import { AllowedFolders, uploadImageToCloudinary } from './uploadImageToCloudinary';

export const uploadMultipleFilesToCloudinary = async (
  files: Express.Multer.File[],
  folder: AllowedFolders,
  isPrimaryIndex?: number,
) => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const result = await uploadImageToCloudinary(file, folder);

      // Add isPrimary flag if is defined
      if (isPrimaryIndex !== undefined) {
        return {
          ...result,
          isPrimary: index === isPrimaryIndex,
        };
      }

      return result;
    });

    return Promise.all(uploadPromises);
  } catch {
    throw new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      isOperational: false,
      description: 'Ha ocurrido un error al subir las imagenes',
    });
  }
};
