import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { uploadMultipleFilesToCloudinary } from '../../../shared/utils/uploadMultipleImaesToCloudinary';
import { CreateProduct } from '../interfaces/createProduct.type';
import { ProductModel } from '../models/product.model';
import { ProductCategoryModel } from '../models/productCategory.model';

export const createProductService = async (productData: CreateProduct, imagesToUpload: Express.Multer.File[]) => {
  const existsCategory = await ProductCategoryModel.getCategoryById(productData.categoryId);

  if (!existsCategory) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'La categoría no existe',
    });
  }

  const existsProduct = await ProductModel.getProductByName(productData.name);

  if (existsProduct) {
    throw new AppError({
      httpCode: HttpCode.CONFLICT,
      description: `El producto con el nombre ${productData.name} ya existe`,
    });
  }

  if (productData.primaryImageIndex && productData.primaryImageIndex >= imagesToUpload.length) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'El indice de la imagen primaria no es valido',
    });
  }

  // Upload images to cloudinary
  const images = await uploadMultipleFilesToCloudinary(imagesToUpload, 'products', productData.primaryImageIndex);

  const newProduct = await ProductModel.createProduct({ ...productData, images });

  return newProduct;
};
