import { z } from 'zod';

export const createProductCategorySchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3).optional(),
  isActive: z.boolean().optional(),
});

export const updateProductCategorySchema = createProductCategorySchema
  .pick({ description: true, isActive: true })
  .extend({
    name: z.string().min(3).optional(),
  });

export const idProductCategorySchema = z.object({ id: z.coerce.number().positive() });
