import { z } from 'zod';

export const idTrainerSchema = z.object({ id: z.coerce.number().positive() });

export const updateTrainerSchema = z.object({
  firstName: z.string().min(3).optional(),
  lastName: z.string().min(3).optional(),
  phoneNumber: z.string().min(12).optional(),
  birthDate: z.coerce.date().optional(),
  email: z.string().email().optional(),
});
