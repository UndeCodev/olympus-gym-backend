import { Product } from '../../../core/entities/Product';

export interface ProductPaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: 'STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
