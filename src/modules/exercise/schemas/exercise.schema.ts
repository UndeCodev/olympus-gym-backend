import { z } from 'zod';

const importantTipSchema = z.object({
  tipText: z
    .string({
      required_error: 'El texto del consejo es requerido',
    })
    .min(5, 'El consejo debe tener al menos 5 caracteres'),
});

const stepByStepInstructionSchema = z.object({
  order: z
    .number({
      required_error: 'El orden del paso es requerido',
    })
    .int()
    .positive(),
  instructionText: z
    .string({
      required_error: 'El texto de la instrucción es requerido',
    })
    .min(5, 'La instrucción debe tener al menos 5 caracteres'),
});

const exerciseInstructionSchema = z.object({
  difficultyLevelId: z
    .number({
      required_error: 'El ID de dificultad es requerido',
    })
    .int()
    .positive(),
  sets: z
    .number({
      required_error: 'El número de series es requerido',
    })
    .int()
    .positive(),
  repetitionsMin: z
    .number({
      required_error: 'Las repeticiones mínimas son requeridas',
    })
    .int()
    .positive(),
  repetitionsMax: z
    .number({
      required_error: 'Las repeticiones máximas son requeridas',
    })
    .int()
    .positive(),
  restTimeSeconds: z
    .number({
      required_error: 'El tiempo de descanso es requerido',
    })
    .int()
    .positive(),

  stepByStepInstructions: z.array(stepByStepInstructionSchema).min(1, 'Se requiere al menos un paso de instrucción'),

  importantTips: z.array(importantTipSchema).optional(),
});

export const createExerciseSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre es requerido',
    })
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  imageUrl: z.string().url('La URL de la imagen no es válida').optional(),
  muscleGroupIds: z.array(z.number().int().positive()).min(1, 'Se requiere al menos un ID de grupo muscular'),
  instructions: z
    .array(exerciseInstructionSchema)
    .min(1, 'Se requiere al menos un conjunto de instrucciones (por nivel)'),
});


const idParamSchema = z.object({
  id: z.coerce.number({
    required_error: 'El ID es requerido',
    invalid_type_error: 'El ID debe ser un número',
  })
  .int('El ID debe ser un entero')
  .positive('El ID debe ser un número positivo'),
});

export const getExercisesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    muscleGroupId: z.coerce.number().int().optional(),
    difficultyLevelId: z.coerce.number().int().optional(),
  }),
});

export const getDeleteExerciseSchema = z.object({
  params: idParamSchema,
});

export const updateExerciseSchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').optional(),
    description: z.string().optional(),
    imageUrl: z.string().url('La URL de la imagen no es válida').optional().nullable(),
  
    muscleGroupIds: z.array(z.number().int().positive())
        .min(1, 'Se requiere al menos un ID de grupo muscular').optional(),

  }).strict().refine(data => Object.keys(data).length > 0, {
      message: 'El cuerpo de la solicitud no puede estar vacío para la actualización',
  }),
});