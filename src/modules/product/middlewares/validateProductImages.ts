// src/modules/products/middlewares/validateProductImages.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { MAX_IMAGES_PER_PRODUCT } from '../constants/maxImagesPerProduct';
import { ProductModel } from '../models/product.model';

export const validateProductImages = (action: 'create' | 'update') => {
  return async (req: Request, _: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    if (action === 'create') {
      if (!req.files || req.files.length === 0) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: 'Debes de subir al menos una imagen',
        });
      }

      if (files && files.length > MAX_IMAGES_PER_PRODUCT) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: `No puedes subir más de ${MAX_IMAGES_PER_PRODUCT} imágenes por producto`,
        });
      }
    }

    if (action === 'update') {
      if (!files || files.length === 0) {
        return next();
      }

      const deletedImages = req.body.deletedImages ? JSON.parse(req.body.deletedImages) : [];

      // Obtener el producto actual para saber cuántas imágenes tiene
      const productId = req.params.id;
      const product = await ProductModel.getProductById(Number(productId));

      if (!product) {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: 'Producto no encontrado',
        });
      }

      const currentImagesCount = product.images.length;
      const imagesToDeleteCount = deletedImages.length;
      const newImagesCount = files.length;

      const totalImagesAfterUpdate = currentImagesCount - imagesToDeleteCount + newImagesCount;

      if (totalImagesAfterUpdate > MAX_IMAGES_PER_PRODUCT) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: `No puedes exceder el límite de ${MAX_IMAGES_PER_PRODUCT} imágenes por producto`,
        });
      }
    }

    next();
  };
};
