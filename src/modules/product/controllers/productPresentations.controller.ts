import { Request, Response } from 'express';
import { ProductPresentationsModel } from '../models/productPresentations.model';

export class ProductPresentationsController {
  static async getAllProductPresentations(_req: Request, res: Response) {
    const productPresentations = await ProductPresentationsModel.getAllProductPresentations();

    res.json(productPresentations);
  }
}
