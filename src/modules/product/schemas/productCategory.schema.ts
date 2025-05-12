import { z } from 'zod';

export const nameProductCategorySchema = z.object({ name: z.string().min(3) });

export const idProductCategorySchema = z.object({ id: z.coerce.number().positive() });
