import { AppError } from '../../core/errors/AppError';
import cloudinary from '../config/cloudinary';
import { HttpCode } from '../interfaces/HttpCode';

export type AllowedFolders = 'products';

export const uploadImageToCloudinary = async (image: Express.Multer.File, folder: AllowedFolders) => {
  try {
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataURI = `data:${image.mimetype};base64,${b64}`;

    const { public_id, secure_url } = await cloudinary.uploader.upload(dataURI, {
      folder: `olympus_gym/${folder}`,
    });

    return { publicId: public_id, url: secure_url };
  } catch {
    throw new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      isOperational: false,
      description: 'Ha ocurrido un error al subir la imagen',
    });
  }
};
