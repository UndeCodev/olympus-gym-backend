import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import upload from '../../../shared/config/multer';

export const productRoutes = Router();

productRoutes.get('/', ProductController.getAllProducts);
productRoutes.get('/:id', ProductController.getProductById);

productRoutes.post('/', upload.array('images', 5), ProductController.createProduct);
productRoutes.delete('/:id', ProductController.deleteProductById);
