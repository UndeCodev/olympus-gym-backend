import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import upload from '../../../shared/config/multer';

export const productRoutes = Router();

productRoutes.post('/', upload.array('images', 5), ProductController.createProduct);
