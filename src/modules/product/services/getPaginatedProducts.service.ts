import { ProductPaginationOptions } from '../interfaces/productsPagination.interface';
import { ProductModel } from '../models/product.model';

export const getPaginatedProductsService = async (options: ProductPaginationOptions) => {
  const products = await ProductModel.getPaginatedProducts(options);

  return products;
};
