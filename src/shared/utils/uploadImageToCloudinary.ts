import cloudinary from '../config/cloudinary';

type AllowedFolders = 'products';

export const uploadImageToCloudinary = async (filePath: string, folder: AllowedFolders) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: `olympus_gym/${folder}`,
  });
};
