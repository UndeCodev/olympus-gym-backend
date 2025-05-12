import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { idProductCategorySchema, nameProductCategorySchema } from '../schemas/productCategory.schema';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { ProductCategoryModel } from '../models/productCategory.model';

export class ProductCategoryController {
  static async createCategory(req: Request, res: Response) {
    const { name } = await validateSchema(nameProductCategorySchema, req.body);

    await ProductCategoryModel.createCategory(name);

    res.sendStatus(HttpCode.CREATED);
  }

  static async getAllCategories(_: Request, res: Response) {
    const categories = await ProductCategoryModel.getAllCategories();

    res.json({
      categories,
    });
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
    const { name } = await validateSchema(nameProductCategorySchema, req.body);

    const categoryUpdated = await ProductCategoryModel.updateCategory(id, name);

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
