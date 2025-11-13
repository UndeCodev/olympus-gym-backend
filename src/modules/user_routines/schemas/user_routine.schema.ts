import { z } from 'zod';

export const assignRoutineSchema = z.object({
  userId: z
    .number({
      required_error: 'El ID del usuario es requerido',
      invalid_type_error: 'El ID del usuario debe ser un número',
    })
    .int()
    .positive(),

  masterRoutineId: z
    .number({
      required_error: 'El ID de la rutina maestra es requerido',
      invalid_type_error: 'El ID de la rutina maestra debe ser un número',
    })
    .int()
    .positive(),
});

const idParamSchema = (field: string, message: string) =>
  z.object({
    [field]: z.coerce
      .number({
        required_error: `El ID ${message} es requerido`,
        invalid_type_error: `El ID ${message} debe ser un número`,
      })
      .int()
      .positive(),
  });

export const getAssignmentsForUserSchema = z.object({
  params: idParamSchema('userId', 'del usuario'),
});

export const unassignRoutineSchema = z.object({
  params: idParamSchema('id', 'de la asignación'),
});
