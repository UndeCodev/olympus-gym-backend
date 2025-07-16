import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { deleteImagesFromCloudinary } from '../../../shared/utils/deleteImagesFromCloudinary';
import { uploadMultipleFilesToCloudinary } from '../../../shared/utils/uploadMultipleImaesToCloudinary';
import { UpdateProductData } from '../interfaces/updatedProduct.interface';
import { UpdateProductOptions } from '../interfaces/updateProductOptions.interface';
import { ProductModel } from '../models/product.model';
import { ProductCategoryModel } from '../models/productCategory.model';
import { ProductImagesModel } from '../models/productImages.model';

export const updateProductService = async (
  productId: number,
  productData: UpdateProductData,
  options: UpdateProductOptions = {},
) => {
  // 1. Basic validations
  const productFound = await ProductModel.getProductById(productId);

  if (!productFound) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'El producto a actualizar no existe',
    });
  }

  if (productData.categoryId) {
    const categoryFound = await ProductCategoryModel.getCategoryById(productData.categoryId);

    if (!categoryFound) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: 'La categoría no existe',
      });
    }
  }

  if (
    productFound.images.length <= 1 &&
    options.deletedImages &&
    options.deletedImages.length > 0 &&
    !options.newImages
  ) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'No puedes eliminar imagenes de un producto con menos de 1 imágenes',
    });
  }

  // 2. Update basic data of the product
  await ProductModel.updateProductById(productId, productData);

  // 3. Delete flagged images (if any)
  if (options.deletedImages && options.deletedImages.length > 0) {
    const imagesToDelete = await ProductImagesModel.getImagesToDelete(productId, options.deletedImages);

    const publicIds = imagesToDelete.map((image) => image.publicId);

    await deleteImagesFromCloudinary(publicIds);

    await ProductImagesModel.deleteImages(options.deletedImages);
  }

  // 4. Upload new images (if any)
  if (options.newImages && options.newImages.length > 0) {
    const newImages = await uploadMultipleFilesToCloudinary(options.newImages, 'products', options.newPrimaryImageId);

    await ProductImagesModel.addImages(productId, newImages);
  }

  // 5. Update primary image
  if (options.existingPrimaryImageId) {
    await ProductImagesModel.updateProductPrimaryImage(productId, options.existingPrimaryImageId);
  }

  // 6. Return updated product
  const productUpdated = await ProductModel.getProductById(productId);

  return productUpdated;
};
