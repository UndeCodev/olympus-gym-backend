import { z } from 'zod';

const routineExerciseSchema = z.object({
  exerciseId: z.number({
    required_error: 'El ID del ejercicio es requerido',
  }).int().positive(),
  
  orderInRoutine: z.number({
    required_error: 'El orden del ejercicio es requerido',
  }).int().positive(),
});

const validDays = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
] as const;

export const createMasterRoutineSchema = z.object({
  name: z.string({
    required_error: 'El nombre de la rutina es requerido',
  }).min(5, 'El nombre debe tener al menos 5 caracteres'),

  // Validamos un array de strings que deben coincidir con los días válidos
  daysOfTheWeek: z.array(z.enum(validDays, {
    errorMap: () => ({ message: 'El día de la semana no es válido' })
  }))
  .min(1, 'Se requiere al menos un día de la semana')
  .nonempty('El array de días no puede estar vacío'),

  estimatedTimeMinutes: z.number({
    required_error: 'El tiempo estimado es requerido',
  }).int().positive('El tiempo debe ser un número positivo'),

  // Validamos el array de ejercicios
  exercises: z.array(routineExerciseSchema)
    .min(1, 'Se requiere al menos un ejercicio en la rutina')
    .nonempty('El array de ejercicios no puede estar vacío'),
});

const idParamSchema = z.object({
  id: z.coerce.number({
    required_error: 'El ID es requerido',
    invalid_type_error: 'El ID debe ser un número',
  })
  .int('El ID debe ser un entero')
  .positive('El ID debe ser un número positivo'),
});

/** Esquema para Listar (GET /) */
export const getMasterRoutinesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
  }),
});


/** Esquema para Obtener/Eliminar (GET/DELETE /:id) */
export const getDeleteMasterRoutineSchema = z.object({
  params: idParamSchema,
});

/** Esquema para Actualizar (PUT /:id) */
export const updateMasterRoutineSchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: z.string().min(5).optional(),
    daysOfTheWeek: z.array(z.enum(validDays)).min(1).optional(),
    estimatedTimeMinutes: z.number().int().positive().optional(),
    exercises: z.array(routineExerciseSchema).min(1).optional(),
  }).strict().refine(data => Object.keys(data).length > 0, {
      message: 'El cuerpo de la solicitud no puede estar vacío para la actualización',
  }),
});