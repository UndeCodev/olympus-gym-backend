import { z } from 'zod';

export const createDifficultyLevelSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre es requerido',
    })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .trim(),
});

const idParamSchema = z.object({
  id: z.coerce
    .number({
      required_error: 'El ID es requerido',
      invalid_type_error: 'El ID debe ser un número',
    })
    .int('El ID debe ser un entero')
    .positive('El ID debe ser un número positivo'),
});

export const getDifficultyLevelsSchema = z.object({
  search: z.string().optional(),
});

export const getDeleteDifficultyLevelSchema = idParamSchema.pick({ id: true });

export const updateDifficultyLevelSchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: z
      .string({
        required_error: 'El nombre es requerido',
      })
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(50, 'El nombre no puede exceder los 50 caracteres')
      .trim(),
  }),
});
