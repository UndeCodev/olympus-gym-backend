import { z } from 'zod';

export const productSearchSchema = z.object({
  searchTerm: z.string().min(3, 'El término de búsqueda debe tener al menos 3 caracteres'),
});

export const productPaginationSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  status: z.enum(['STOCK', 'OUT_OF_STOCK', 'LOW_STOCK']).optional(),
  sortBy: z.enum(['name', 'price']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
