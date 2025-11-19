import { z } from 'zod';

const idParamSchema = z.object({
  id: z.coerce.number({
    required_error: 'El ID es requerido',
    invalid_type_error: 'El ID debe ser un número',
  }).int().positive(),
});

/** Create a plan (POST) */
export const createPlanSchema = z.object({
  name: z.string({
    required_error: 'El nombre del plan es requerido',
  }).min(3, 'El nombre debe tener al menos 3 caracteres').trim(),
  
  description: z.string().optional(),
  
  price: z.number({
    required_error: 'El precio es requerido',
    invalid_type_error: 'El precio debe ser un número',
  }).positive('El precio debe ser positivo'),

  durationMonths: z.number({
    required_error: 'La duración en meses es requerida',
    invalid_type_error: 'La duración debe ser un número',
  }).int().positive('La duración debe ser al menos 1 mes'),
});

/** Update plan (PUT) */
export const updatePlanSchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    durationMonths: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
  }).strict().refine(data => Object.keys(data).length > 0, {
    message: 'El cuerpo de la solicitud no puede estar vacío',
  }),
});

/** Get/Delete plan (GET/DELETE by ID) */
export const getDeletePlanSchema = z.object({
  params: idParamSchema,
});

