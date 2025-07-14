import { Request, Response } from 'express';
import { ProductBrandsModel } from '../models/productBrands.model';

export class ProductBrandsController {
  static async getAllProductBrands(_req: Request, res: Response) {
    const productBrands = await ProductBrandsModel.getAllProductBrands();
    
    res.json(productBrands);
  }
}