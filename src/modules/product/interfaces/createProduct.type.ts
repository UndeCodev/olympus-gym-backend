import { Product } from '../../../core/entities/Product';

export type CreateProduct = Pick<Product, 'name' | 'description' | 'price' | 'stock' | 'categoryId' | 'images' | 'brandId' | 'presentationId'> & {
  primaryImageIndex?: number;
};
