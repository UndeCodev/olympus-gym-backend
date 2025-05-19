import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import upload from '../../../shared/config/multer';
import { validateProductImages } from '../middlewares/validateProductImages';
import { multerErrorHandler } from '../../../shared/middlewares/multerError';

export const productRoutes = Router();

// Specific routes first
productRoutes.get('/search', ProductController.searchProducts);

productRoutes.get('/', ProductController.getAllProducts);
productRoutes.get('/:id', ProductController.getProductById);

productRoutes.post(
  '/',
  upload.array('images', 5),
  multerErrorHandler,
  validateProductImages('create'),
  ProductController.createProduct,
);

productRoutes.patch(
  '/:id',
  upload.array('newImages', 5),
  multerErrorHandler,
  validateProductImages('update'),
  ProductController.updateProduct,
);

productRoutes.delete('/:id', ProductController.deleteProductById);
