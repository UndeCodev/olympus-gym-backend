import cloudinary from '../config/cloudinary';

export const deleteImagesFromCloudinary = async (publicIds: string[]) => {
  try {
    await cloudinary.api.delete_resources(publicIds);
  } catch (error) {
    throw new Error(`Error deleting images from Cloudinary: ${error}`);
  }
};
