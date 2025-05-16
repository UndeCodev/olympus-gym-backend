import { Router } from 'express';
import { categoryRoutes } from './productCategory.routes';
import { productRoutes } from './product.routes';

const productsRouter = Router();

productsRouter.use('/', productRoutes);
productsRouter.use('/category', categoryRoutes);

export default productsRouter;
