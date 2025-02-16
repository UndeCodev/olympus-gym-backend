import { PrismaClient, Product } from "@prisma/client";
import { HttpCode } from "../enums";
import { AppError } from "../exceptions/AppError";
import { CategoriesModel } from "./categories";

const prisma = new PrismaClient()

export class ProductsModel {
    static async getAllProducts (page: number, limit: number): Promise<{ products: Product[], totalProducts: number, totalPages: number } | AppError> {
        const skip = (page - 1) * limit
        const totalProducts = await prisma.product.count()
        
        const products = await prisma.product.findMany({
            skip,
            take: limit,
            include: {
                category: { 
                    select: { name: true }
                }
            }
        })

        if(products.length === 0 || !products){
            throw new AppError({
                name: 'GetAllProductsError',
                httpCode: HttpCode.BAD_REQUEST,
                description: `No products found in database`
            })
        }

        return {
            products,
            totalProducts: totalProducts,
            totalPages: Math.ceil(totalProducts / limit)
        }
    }

    static async getProductById(id: number): Promise <Product | AppError>{
        const product = await prisma.product.findUnique({
            where: {id},
            include: {
                category: { 
                    select: { name: true }
                }
            }
        })

        if(!product){
            throw new AppError({
                name: 'ProductNotFound',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Product by id: ${id} not exist in database.`
            })
        }
        return product
    }

    static async getProductsBySearchResult(query: string, page: number, limit: number): Promise<{products: Product[], totalProducts: number, totalPages: number} | AppError>{
        const skip = (page - 1) * limit
        const searchProductsTerms = query.split(" ")
        
        const products = await prisma.product.findMany({
            where: {
                OR: searchProductsTerms.map(term =>({
                    OR: [
                        { name: { contains: term } },
                        { description: { contains: term } }
                    ]
                }))
            },
            skip,
            take: limit,
            include: { category: { select: { name: true } } }
        })

        const totalProducts = await prisma.product.count({
            where: {
                OR: searchProductsTerms.map(term => ({
                    OR: [
                        { name: { contains: term } },
                        { description: { contains: term } }
                    ]
                }))
            }
        })

        if(totalProducts === 0){
            throw new AppError({
                name: 'ProductsNotFound',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Products no matches found by: ${query}.`
            })
        }

        return {
            products,
            totalProducts: totalProducts,
            totalPages: Math.ceil(totalProducts / limit)
        }
    }

    static async createProduct (input: Omit< Product, "id">, image: string ): Promise <Product | AppError>{
        const {name, description, price, categoryId, stockAvailable, status} = input

        //validate category exists in database
        await CategoriesModel.getCategoryById(categoryId)

        const createProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                categoryId,
                stockAvailable,
                status,
                dateAdded: new Date(), 
            }
        })

        if(!createProduct){
            throw new AppError({
                name: 'ErrorProductCreate',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Error during create product.`
            })
        }

        await prisma.productImage.create({
            data: {
                productId: createProduct.id,
                imageURL: image
            },
        });
        
        return createProduct
    }

    static async updateProduct(id: number, data: Partial<Product>): Promise<Product | AppError>{
        const productUpdate = await prisma.product.update({
            where: {id},
            data
        })

        if(!productUpdate){
            throw new AppError({
                name: 'ErrorProductUpdate',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Error during update product by id: ${id}`
            })
        }
        return productUpdate
    }
}