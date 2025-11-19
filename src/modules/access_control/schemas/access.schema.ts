import { z } from 'zod';

export const validateQrSchema = z.object({
  qrToken: z.string({
    required_error: 'El token del QR es requerido',
  }),
});