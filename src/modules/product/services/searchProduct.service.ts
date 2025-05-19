import { ProductModel } from '../models/product.model';

export const searchProductsService = async (searchTerm: string) => {
  return ProductModel.searchProducts(searchTerm);
};
