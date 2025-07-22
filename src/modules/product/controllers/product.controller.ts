import { Request, Response } from 'express';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import {
  createProductSchema,
  getProductCartRecommendationsSchema,
  getProductRecommendationsSchema,
  idProductSchema,
  updateProductSchema,
} from '../schemas/product.schema';
import { createProductService } from '../services/createProduct.service';
import { ProductModel } from '../models/product.model';
import { deleteProductService } from '../services/deleteProduct.service';
import { UpdateProductData } from '../interfaces/updatedProduct.interface';
import { UpdateProductOptions } from '../interfaces/updateProductOptions.interface';
import { updateProductService } from '../services/updateProduct.service';
import { productPaginationSchema, productSearchSchema } from '../schemas/productPagination.schema';
import { searchProductsService } from '../services/searchProduct.service';
import { getPaginatedProductsService } from '../services/getPaginatedProducts.service';
import { getProductRecommendationsService } from '../services/getProductRecommendations.service';
import { getCartRecommendationsService } from '../services/getCartRecommendations.service';

export class ProductController {
  static async getAllProducts(_: Request, res: Response) {
    const products = await ProductModel.getAllProducts();

    res.json({ products });
  }

  static async getProductById(req: Request, res: Response) {
    const { id } = await validateSchema(idProductSchema, req.params);

    const product = await ProductModel.getProductById(id);

    res.json({ product });
  }

  static async createProduct(req: Request, res: Response) {
    const images = req.files as Express.Multer.File[];
    const productData = await validateSchema(createProductSchema, req.body);

    const productCreated = await createProductService(productData, images);

    res.json({
      productCreated,
    });
  }

  static async updateProduct(req: Request, res: Response) {
    const { id } = await validateSchema(idProductSchema, req.params);
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      presentationId,
      brandId,
      deletedImages,
      newPrimaryImageId,
      existingPrimaryImageId,
    } = await validateSchema(updateProductSchema, req.body);

    const files = req.files as Express.Multer.File[];

    const updateData: UpdateProductData = { name, description, price, stock, categoryId, presentationId, brandId };
    const updateOptions: UpdateProductOptions = {
      deletedImages,
      newPrimaryImageId,
      newImages: files,
      existingPrimaryImageId,
    };

    const updatedProduct = await updateProductService(id, updateData, updateOptions);

    res.json({
      product: updatedProduct,
    });
  }

  static async deleteProductById(req: Request, res: Response) {
    const { id } = await validateSchema(idProductSchema, req.params);

    await deleteProductService(id);

    res.sendStatus(HttpCode.NO_CONTENT);
  }

  static async searchProducts(req: Request, res: Response) {
    const { searchTerm } = await validateSchema(productSearchSchema, req.query);

    const products = await searchProductsService(searchTerm);

    res.json({
      products,
    });
  }

  static async getPaginatedProducts(req: Request, res: Response) {
    const queryParams = await validateSchema(productPaginationSchema, req.query);

    const result = await getPaginatedProductsService(queryParams);

    res.json(result);
  }

  static async getProductRecommendations(req: Request, res: Response) {
    const { productName } = await validateSchema(getProductRecommendationsSchema, req.body);

    const recommendations = await getProductRecommendationsService(productName);

    res.json(recommendations);
  }

  static async getCartRecommendations(req: Request, res: Response) {
    const { products } = await validateSchema(getProductCartRecommendationsSchema, req.body);

    const recommendations = await getCartRecommendationsService(products);

    res.json(recommendations)
  }
}
