import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { deleteImagesFromCloudinary } from '../../../shared/utils/deleteImagesFromCloudinary';
import { ProductModel } from '../models/product.model';

export const deleteProductService = async (id: number) => {
  const product = await ProductModel.getProductById(id);

  if (!product) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'El producto a eliminar no existe',
    });
  }

  const publicIds = product.images.map((image) => image.publicId);

  await deleteImagesFromCloudinary(publicIds);

  await ProductModel.deleteProductById(id);
};
