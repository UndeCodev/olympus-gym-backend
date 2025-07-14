import { z } from 'zod';
import { alpha } from '../../../shared/utils/regexUtils';

export const updateProfileSchema = z.object({
  firstName: z.string().regex(alpha, { message: 'Only letters are allowed' }).min(3).optional(),
  lastName: z.string().regex(alpha, { message: 'Only letters are allowed' }).min(3).optional(),
  phoneNumber: z.string().min(12).optional(),
  email: z.string().email().optional(),
});
