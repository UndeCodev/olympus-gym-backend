import { Router } from 'express'
import { ProductsController } from '../controllers/products'

export const productsRouter = Router()

productsRouter.post('/', ProductsController.getAllProducts)
productsRouter.get('/:id', ProductsController.getProductById)
productsRouter.post('/createProduct', ProductsController.createProduct)
productsRouter.post('/getProductsBySearchResult', ProductsController.getProductsBySearchResult)
productsRouter.put('/updateProduct/:id', ProductsController.updateProduct)
