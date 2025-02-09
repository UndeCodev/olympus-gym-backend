import { NextFunction, Request, Response } from "express";
import { CategoriesModel } from "../models/categories";
import { HttpCode } from "../enums";
import { categoryCreationSchema } from "../schemas/Categories";


export class CategoriesController {
    static async getAllCategories (_req: Request, res: Response, next: NextFunction): Promise <void> {
        try {
            const categories = await CategoriesModel.getAllCategories()
            
            res.status(HttpCode.OK).json({
                categories: categories
            })
        } catch (error) {
            next(error)
        }
    }

    static async getCategoryById(req: Request, res: Response, next: NextFunction): Promise <void> {
        try {
            const id = parseInt(req.params.id)

            if(isNaN(id)){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Invalid ID'
                })
                return
            }
            const resultGetCategoryById = await CategoriesModel.getCategoryById(id)
            res.status(HttpCode.OK).json({
                category: resultGetCategoryById
            })
        } catch (error) {
            next(error)
        }
    }

    static async getProductsByCategory(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const id = parseInt(req.params.id)
            if(isNaN(id)){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Invalid id'
                })
            }

            //verify that category exists in database
            await CategoriesModel.getCategoryById(id)

            const resultGetProductByCategory = await CategoriesModel.getProductsByCategory(id)

            res.status(HttpCode.OK).json({
                productsBycategory: resultGetProductByCategory
            })
        } catch (error) {
            next(error)
        }
    }

    static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const resultValidationInputData = categoryCreationSchema.safeParse(req.body)

            if(!resultValidationInputData.success){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Validation Category Error',
                    errors: resultValidationInputData.error.format()
                })
                return
            }

            await CategoriesModel.createCategory(resultValidationInputData.data)
            res.status(HttpCode.CREATED).json({
                message: 'Category created sucessfully.'
            })
        } catch (error) {
            next(error)
        }
    }
}