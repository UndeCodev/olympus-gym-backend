import { Request, Response } from 'express';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { createProductSchema, idProductSchema } from '../schemas/product.schema';
import { createProductService } from '../services/createProduct.service';
import { ProductModel } from '../models/product.model';

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
    if (!req.files || req.files.length === 0) {
      res.status(HttpCode.BAD_REQUEST).json({ message: 'Debes de subir al menos una imagen' });
      return;
    }

    const images = req.files as Express.Multer.File[];
    const productData = await validateSchema(createProductSchema, req.body);

    await createProductService(productData, images);

    res.sendStatus(HttpCode.CREATED);
  }
}
