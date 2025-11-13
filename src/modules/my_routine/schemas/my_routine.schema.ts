import { z } from 'zod';

export const getMyRoutineSchema = z.object({
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'La fecha debe estar en formato YYYY-MM-DD',
    }).optional(),
  }),
});