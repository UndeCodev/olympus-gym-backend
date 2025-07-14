import { z } from 'zod';

export const verificationSchema = z.object({ verificationCode: z.string().min(6).max(6) });

export const userIdSchema = z.object({ userId: z.coerce.number().positive() });

export const addCartItemSchema = z.object({
  userId: z.coerce.number().positive(),
  productId: z.coerce.number().positive(),
  quantity: z.coerce.number().positive().optional(),
});
