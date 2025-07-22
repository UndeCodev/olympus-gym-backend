import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import upload from '../../../shared/config/multer';
import { validateProductImages } from '../middlewares/validateProductImages';
import { multerErrorHandler } from '../../../shared/middlewares/multerError';
import { authorize } from '../../auth/middlewares/authorize';
import { authenticate } from '../../auth/middlewares/authenticate';
import { requireAuth } from '../../auth/middlewares/requireAuth';

export const productRoutes = Router();

// Specific routes first
productRoutes.get('/search', ProductController.searchProducts);
productRoutes.get('/paginated', ProductController.getPaginatedProducts);

productRoutes.get('/', ProductController.getAllProducts);
productRoutes.get('/:id', ProductController.getProductById);

productRoutes.post(
  '/',
  authenticate,
  requireAuth,
  authorize(['ADMIN']),
  upload.array('images', 5),
  multerErrorHandler,
  validateProductImages('create'),
  ProductController.createProduct,
);

productRoutes.post('/get-recommendations', ProductController.getProductRecommendations);
productRoutes.post('/get-cart-recommendations', ProductController.getCartRecommendations);

productRoutes.patch(
  '/:id',
  authenticate,
  requireAuth,
  authorize(['ADMIN']),
  upload.array('newImages', 5),
  multerErrorHandler,
  validateProductImages('update'),
  ProductController.updateProduct,
);

productRoutes.delete('/:id', authenticate, requireAuth, authorize(['ADMIN']), ProductController.deleteProductById);
