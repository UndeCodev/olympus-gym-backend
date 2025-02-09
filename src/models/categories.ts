import { Category, PrismaClient } from "@prisma/client";
import { AppError } from "../exceptions/AppError";
import { HttpCode } from "../enums";

const prisma = new PrismaClient()

export class CategoriesModel {

    static async getAllCategories(): Promise <Category[] | AppError | null>{
        const categories = await prisma.category.findMany()

        if(categories.length === 0 || !categories){
            throw new AppError({
                name: 'GetAllCategoriesError',
                httpCode: HttpCode.BAD_REQUEST,
                description: `No categories found in database`
            })
        }
        return categories
    }

    static async getCategoryById(id: number):Promise<Category | null>{
        const categoryById = await prisma.category.findUnique({
            where: {id}
        })

        if(!categoryById){
            throw new AppError({
                name: 'GetCategorieByIdError',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Category by id: ${id} not exist in database.`
            })
        }
        return categoryById
    }

    static async getProductsByCategory(categoryId: number): Promise<Category | AppError>{
        const productsByCategory = await prisma.category.findUnique({
            where: {id: categoryId},
            include: {products: true}
        })

        if(productsByCategory?.products.length === 0 || !productsByCategory){
            throw new AppError({
                name: 'ProductsNotFoundByCategory',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Products by categoryId: ${categoryId} not exist in database.`
            })
        }
        return productsByCategory
    }

    static async getCategoryByName(input: string): Promise<Category | AppError | null>{
        const name = input
        const categoryByName = await prisma.category.findUnique({
            where: {name}
        })

        return categoryByName
    }

    static async createCategory (input:Omit< Category, "id">): Promise<Category | AppError> {
        const {name} = input

        const resultValidateCategoryExistsInDatabase = await this.getCategoryByName(name)

        if(resultValidateCategoryExistsInDatabase){
            throw new AppError({
                name: 'GetCategorieByNameAlreadyExists',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Category by name: ${name} already exist in database.`
            })
        }

        const createCategory = await prisma.category.create({
            data: {
                name,
            }
        })
        
        if(!createCategory){
            throw new AppError({
                name: 'ErrorCategoryCreate',
                httpCode: HttpCode.BAD_REQUEST,
                description: 'Error during create Category.'
            })
        }

        return createCategory
    }
}