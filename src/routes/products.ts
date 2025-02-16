import { Router } from 'express'
import { ProductsController } from '../controllers/products'
import { upload } from '../config/multer.config'

export const productsRouter = Router()

productsRouter.post('/', ProductsController.getAllProducts)
productsRouter.get('/:id', ProductsController.getProductById)
productsRouter.post('/createProduct', upload.single("file"),ProductsController.createProduct)
productsRouter.post('/getProductsBySearchResult', ProductsController.getProductsBySearchResult)
productsRouter.put('/updateProduct/:id', ProductsController.updateProduct)
