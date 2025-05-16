import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().positive(),
  categoryId: z.coerce.number().positive(),
  primaryImageIndex: z.coerce.number().min(0).max(5).default(0),
});

export const idProductSchema = z.object({
  id: z.coerce.number().positive(),
});
