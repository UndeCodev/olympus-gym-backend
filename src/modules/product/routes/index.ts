import { Router } from 'express';

import { categoryRoutes } from './productCategory.routes';
import { productRoutes } from './product.routes';
import { reservationRoutes } from '../../reservation/routes/reservationroutes';
import { productBrandsRoutes } from './productBrands.routes';
import { productPresentationsRoutes } from './productPresentations.routes';

const productsRouter = Router();

productsRouter.use('/reservation', reservationRoutes);
productsRouter.use('/category', categoryRoutes);
productsRouter.use('/brands', productBrandsRoutes);
productsRouter.use('/presentations', productPresentationsRoutes);
productsRouter.use('/', productRoutes);

export default productsRouter;
