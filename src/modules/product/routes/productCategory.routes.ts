import { Router } from 'express';
import { ProductCategoryController } from '../controllers/productCategory.controller';

export const categoryRoutes = Router();

categoryRoutes.post('/', ProductCategoryController.createCategory);
categoryRoutes.get('/', ProductCategoryController.getAllCategories);
categoryRoutes.get('/search', ProductCategoryController.searchCategories);

categoryRoutes.get('/:id', ProductCategoryController.getCategoryById);
categoryRoutes.put('/:id', ProductCategoryController.updateCategoryById);
categoryRoutes.delete('/:id', ProductCategoryController.deleteCategoryById);
