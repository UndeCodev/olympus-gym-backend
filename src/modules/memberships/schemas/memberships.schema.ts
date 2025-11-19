import { z } from 'zod';

/**
 * Esquema para Asignar/Vender una Membresía (POST)
 */
export const assignMembershipSchema = z.object({
  userId: z.number({
    required_error: 'El ID del usuario es requerido',
  }).int().positive(),

  planId: z.number({
    required_error: 'El ID del plan es requerido',
  }).int().positive(),

  // Opcional: Referencia de pago (ej. "Efectivo", "Transferencia #1234", "Stripe_ID")
  paymentRef: z.string().optional(),
  
  // Opcional: Permitir definir una fecha de inicio manual (si no es hoy)
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'La fecha debe estar en formato YYYY-MM-DD',
  }).optional(),
});

const idParamSchema = z.object({
  userId: z.coerce.number({
    required_error: 'El ID del usuario es requerido',
  }).int().positive(),
});

/** Esquema para Renovar (Extender) */
export const renewMembershipSchema = z.object({
  userId: z.number().int().positive(),
  monthsToExtend: z.number({
    required_error: 'El número de meses a extender es requerido',
  }).int().positive('Debe ser al menos 1 mes'),
});

/** Esquema para Cancelar */
export const cancelMembershipSchema = z.object({
  userId: z.number().int().positive(),
  reason: z.string().optional(), 
});

/** Esquema para Obtener Historial (GET /user/:userId) */
export const getUserHistorySchema = z.object({
  params: idParamSchema,
});



