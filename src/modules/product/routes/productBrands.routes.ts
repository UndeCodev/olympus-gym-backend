import { Router } from 'express';
import { ProductBrandsController } from '../controllers/productBrands.controller';

export const productBrandsRoutes = Router();

productBrandsRoutes.get('/', ProductBrandsController.getAllProductBrands);

