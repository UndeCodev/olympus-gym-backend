import { z } from 'zod';

export const addCartItemSchema = z.object({
  productId: z.coerce.number().positive(),
  quantity: z.number().int().positive().optional().default(1)
});

export const addCartItemsSchema = z.object({
  items: z.array(addCartItemSchema).nonempty(),
});


export const updateCartItemSchema = addCartItemSchema
  .pick({ productId: true })
  .extend({ newQuantity: z.coerce.number().positive() });

export const deleteCartItemSchema = z.object({ productId: z.coerce.number().positive() });
