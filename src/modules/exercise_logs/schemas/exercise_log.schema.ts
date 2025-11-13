import { z } from 'zod';

export const markExerciseSchema = z.object({
  exerciseId: z.number({
    required_error: 'El ID del ejercicio es requerido',
    invalid_type_error: 'El ID del ejercicio debe ser un número',
  }).int().positive(),

  completed: z.boolean({
    required_error: 'El estado "completado" es requerido',
    invalid_type_error: 'El estado "completado" debe ser un booleano (true/false)',
  }),

  // La fecha en formato YYYY-MM-DD. Si no se provee, se usa la fecha actual.
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe estar en formato YYYY-MM-DD',
  }).optional(),
});

