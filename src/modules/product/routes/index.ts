import { Router } from 'express';
import { categoryRoutes } from './productCategory.routes';

const productsRouter = Router();

productsRouter.use('/category', categoryRoutes);

export default productsRouter;
