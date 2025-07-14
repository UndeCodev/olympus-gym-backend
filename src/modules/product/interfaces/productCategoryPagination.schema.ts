import { z } from 'zod';

export const ProductCategoryPaginationOptions = z.object({
  searchTerm: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});
