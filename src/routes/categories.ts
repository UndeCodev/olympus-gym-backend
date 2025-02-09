import { Router } from 'express'
import { CategoriesController } from '../controllers/categories'

export const categoriesRouter = Router()

categoriesRouter.get('/', CategoriesController.getAllCategories)
categoriesRouter.get('/:id', CategoriesController.getCategoryById)
categoriesRouter.get('/getProductsByCategory/:id', CategoriesController.getProductsByCategory)
categoriesRouter.post('/createCategory', CategoriesController.createCategory)