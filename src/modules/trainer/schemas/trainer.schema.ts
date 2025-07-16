import { z } from 'zod';

export const idTrainerSchema = z.object({ id: z.coerce.number().positive() });

export const createTrainerSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  phoneNumber: z.string().min(12),
  birthDate: z.coerce.date(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    .regex(/[0-9]/, { message: 'La contraseña debe contener al menos un número' })
    .regex(/[^A-Za-z0-9]/, { message: 'La contraseña debe contener al menos un carácter especial' }),
  isActive: z.preprocess(
    (val) => (val === 'true' ? true : val === 'false' ? false : undefined),
    z.boolean(),
  ),
});

export const updateTrainerSchema = z.object({
  firstName: z.string().min(3).optional(),
  lastName: z.string().min(3).optional(),
  phoneNumber: z.string().min(12).optional(),
  birthDate: z.coerce.date().optional(),
  email: z.string().email().optional(),
  isActive: z.coerce.boolean().optional(),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    .regex(/[0-9]/, { message: 'La contraseña debe contener al menos un número' })
    .regex(/[^A-Za-z0-9]/, { message: 'La contraseña debe contener al menos un carácter especial' })
    .optional(),
});

export const searchEmployeeSchema = z.object({
  term: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  isActive: z.preprocess(
    (val) => (val === 'true' ? true : val === 'false' ? false : undefined),
    z.boolean().optional(),
  ),
});
