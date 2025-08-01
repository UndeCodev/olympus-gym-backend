import { z } from 'zod';

export const idProductSchema = z.object({
  id: z.coerce.number().positive(),
});

export const createProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().positive(),
  categoryId: z.coerce.number().positive(),
  brandId: z.coerce.number().positive(),
  presentationId: z.coerce.number().positive(),
  primaryImageIndex: z.coerce.number().min(0).max(5).default(0),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  price: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  categoryId: z.coerce.number().positive().optional(),
  brandId: z.coerce.number().positive(),
  presentationId: z.coerce.number().positive(),
  deletedImages: z.array(z.coerce.number()).optional(),
  newPrimaryImageId: z.coerce.number().optional(),
  existingPrimaryImageId: z.coerce.number().optional(),
});

export const getProductRecommendationsSchema = z.object({
  productName: z.string(),
});

export const getProductCartRecommendationsSchema = z.object({
  products: z.array(z.string()).nonempty(),
})