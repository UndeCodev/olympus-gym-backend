import { Router } from 'express';
import { ProductPresentationsController } from '../controllers/productPresentations.controller';

export const productPresentationsRoutes = Router();

productPresentationsRoutes.get('/', ProductPresentationsController.getAllProductPresentations);

