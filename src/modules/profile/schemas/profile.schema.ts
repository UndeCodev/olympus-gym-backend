import { z } from 'zod';
import { alpha } from '../../../shared/utils/regexUtils';

export const updateProfileSchema = z.object({
  firstName: z.string().regex(alpha, { message: 'Only letters are allowed' }).min(3).optional(),
  lastName: z.string().regex(alpha, { message: 'Only letters are allowed' }).min(3).optional(),
  phoneNumber: z.string().min(12).optional(),
  email: z.string().email().optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    .regex(/[0-9]/, { message: 'La contraseña debe contener al menos un número' })
    .regex(/[^A-Za-z0-9]/, { message: 'La contraseña debe contener al menos un carácter especial' }),
})  