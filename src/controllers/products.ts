import { NextFunction, Request, Response } from "express";
import { ProductsModel } from "../models/products";
import { HttpCode } from "../enums";
import { paginationSchema, productCreationSchema, productUpdateSchema, searchSchema } from "../schemas/Products";
import { Cloudinary } from "../utils/cloudinary.utils";

export class ProductsController {
    static async getAllProducts (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const resultValidationInputData = paginationSchema.safeParse(req.body)

            if(!resultValidationInputData.success){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Validation pagination error',
                    errors: resultValidationInputData.error.format()
                })
                return
            }

            const {page, limit} = resultValidationInputData.data

            const products = await ProductsModel.getAllProducts(page, limit)

            res.status(HttpCode.OK).json({
                products: products
            })
            return
        } catch (error) {
            next(error)
        }
    }

    static async getProductById(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const id = parseInt(req.params.id)
            if(isNaN(id)){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Invalid ID'
                })
                return
            }

            const resultGetProductById = await ProductsModel.getProductById(id)

            res.status(HttpCode.OK).json({
                product: resultGetProductById
            })
        } catch (error) {
            next(error)
        }
    }

    static async getProductsBySearchResult(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const resultValidationInputData = searchSchema.safeParse(req.body)

            if(!resultValidationInputData.success){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'ValidationSearchError',
                    errors: resultValidationInputData.error.format()
                })
                return
            }
            const {query, page, limit} = resultValidationInputData.data

            const productsBySearch = await ProductsModel.getProductsBySearchResult(query, page, limit)

            res.status(HttpCode.OK).json({
                products: productsBySearch
            })
            return
        } catch (error) {
            next(error)
        }
    }

    static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            if(!req.file) {
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'File is required'
                })
                return
            }

            const resultValidationInputData = productCreationSchema.safeParse(req.body)

            if(!resultValidationInputData.success){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Validation Product error',
                    errors: resultValidationInputData.error.format()
                })
                return
            }

            const resultUploadImageToCloudinary: any = await Cloudinary.uploadImage(req.file.buffer)
            if(!resultUploadImageToCloudinary){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Error upload image to cloudinary'
                })
                return
            }
            
            await ProductsModel.createProduct(resultValidationInputData.data, resultUploadImageToCloudinary.secure_url)
            
            res.status(HttpCode.CREATED).json({
                message: 'Product created sucessfully'
            })
            return
        } catch (error) {
            next(error)
        }
    }

    static async updateProduct(req: Request, res: Response, next: NextFunction):Promise<void>{
        try {
            const resultValidationInputData = productUpdateSchema.safeParse(req.body)

            if(!resultValidationInputData.success){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'ValidationInputDataError',
                    errors: resultValidationInputData.error.format()
                })
                return
            }

            const id = parseInt(req.params.id)
            if(isNaN(id)){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Invalid Id'
                })
                return
            }

            const idProductExistInDatabase = await ProductsModel.getProductById(id)

            if(!idProductExistInDatabase){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: `Product by id: ${id}, not found in database`
                })
                return
            }

            await ProductsModel.updateProduct(id, resultValidationInputData.data)
            res.status(HttpCode.OK).json({
                message: 'Product correctly Update'
            })
        } catch (error) {
            next(error)
        }
    }
}