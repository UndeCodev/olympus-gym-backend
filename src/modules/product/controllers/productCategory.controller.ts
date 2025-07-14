import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import {
  createProductCategorySchema,
  idProductCategorySchema,
  updateProductCategorySchema,
} from '../schemas/productCategory.schema';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { ProductCategoryModel } from '../models/productCategory.model';
import { ProductCategoryPaginationOptions } from '../interfaces/productCategoryPagination.schema';

export class ProductCategoryController {
  static async createCategory(req: Request, res: Response) {
    const { name, description, isActive } = await validateSchema(createProductCategorySchema, req.body);

    const categoryCreated = await ProductCategoryModel.createCategory(name, description, isActive);

    res.json({
      categoryCreated,
    });
  }

  static async getAllCategories(_: Request, res: Response) {
    const categories = await ProductCategoryModel.getAllCategories();

    res.json({
      categories,
    });
  }

  static async searchCategories(req: Request, res: Response) {
    const queryParams = await validateSchema(ProductCategoryPaginationOptions, req.query);

    const result = await ProductCategoryModel.getPaginatedCategories(
      queryParams.searchTerm,
      queryParams.page,
      queryParams.limit,
    );

    res.json(result);
  }

  static async getCategoryById(req: Request, res: Response) {
    const { id } = await validateSchema(idProductCategorySchema, req.params);

    const category = await ProductCategoryModel.getCategoryById(id);

    res.json({
      category,
    });
  }

  static async updateCategoryById(req: Request, res: Response) {
    const { id } = await validateSchema(idProductCategorySchema, req.params);
    const { name, description, isActive } = await validateSchema(updateProductCategorySchema, req.body);

    const categoryUpdated = await ProductCategoryModel.updateCategory(id, name, description, isActive);

    res.json({
      categoryUpdated,
    });
  }

  static async deleteCategoryById(req: Request, res: Response) {
    const { id } = await validateSchema(idProductCategorySchema, req.params);

    await ProductCategoryModel.deleteCategoryById(id);

    res.sendStatus(HttpCode.NO_CONTENT);
  }
}
