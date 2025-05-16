import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { uploadImageToCloudinary } from '../../../shared/utils/uploadImageToCloudinary';
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
      httpCode: HttpCode.CONFLIT,
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
  const createPromises = imagesToUpload.map(async (image, index) => {
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataURI = `data:${image.mimetype};base64,${b64}`;

    const { secure_url, public_id } = await uploadImageToCloudinary(dataURI, 'products');

    const isPrimary = index === productData.primaryImageIndex;

    return { url: secure_url, publicId: public_id, isPrimary };
  });

  const images = await Promise.all(createPromises);

  await ProductModel.createProduct({ ...productData, images });
};
