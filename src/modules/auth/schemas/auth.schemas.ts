import { z } from 'zod';

export const createUserSchema = z.object({
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
});

export const loginSchema = createUserSchema.pick({ email: true }).extend({
  password: z.string(),
});

export const emailSchema = z.object({ email: z.string().email() });

export const validateRefreshTokenSchema = z.object({ refreshToken: z.string() });

export const verifyTokenSchema = z.object({ token: z.string() });

export const resetPasswordSchema = verifyTokenSchema.pick({ token: true }).extend({
  newPassword: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    .regex(/[0-9]/, { message: 'La contraseña debe contener al menos un número' })
    .regex(/[^A-Za-z0-9]/, { message: 'La contraseña debe contener al menos un carácter especial' }),
});

export const refreshTokenSchema = z.object({ refreshToken: z.string() });