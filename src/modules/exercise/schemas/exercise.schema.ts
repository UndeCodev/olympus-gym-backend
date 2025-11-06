import { z } from 'zod';

// Esquema para Consejos (ImportantTip)
const importantTipSchema = z.object({
  tipText: z.string({
    required_error: 'El texto del consejo es requerido',
  }).min(5, 'El consejo debe tener al menos 5 caracteres'),
});

// Esquema para Pasos (StepByStepInstruction)
const stepByStepInstructionSchema = z.object({
  order: z.number({
    required_error: 'El orden del paso es requerido',
  }).int().positive(),
  instructionText: z.string({
    required_error: 'El texto de la instrucción es requerido',
  }).min(5, 'La instrucción debe tener al menos 5 caracteres'),
});

// Esquema para la Instrucción de Ejercicio (ExerciseInstruction)
const exerciseInstructionSchema = z.object({
  difficultyLevelId: z.number({
    required_error: 'El ID de dificultad es requerido',
  }).int().positive(),
  sets: z.number({
    required_error: 'El número de series es requerido',
  }).int().positive(),
  repetitionsMin: z.number({
    required_error: 'Las repeticiones mínimas son requeridas',
  }).int().positive(),
  repetitionsMax: z.number({
    required_error: 'Las repeticiones máximas son requeridas',
  }).int().positive(),
  restTimeSeconds: z.number({
    required_error: 'El tiempo de descanso es requerido',
  }).int().positive(),
  
  // Arrays anidados
  stepByStepInstructions: z.array(stepByStepInstructionSchema)
    .min(1, 'Se requiere al menos un paso de instrucción'),
    
  importantTips: z.array(importantTipSchema).optional(),
});

/**
 * Esquema de validación principal para crear un nuevo Ejercicio (POST)
 */
export const createExerciseSchema = z.object({
  name: z.string({
    required_error: 'El nombre es requerido',
  }).min(3, 'El nombre debe tener al menos 3 caracteres'),
  
  description: z.string().optional(),
  imageUrl: z.string().url('La URL de la imagen no es válida').optional(),

  // Array de IDs para la relación N:M
  muscleGroupIds: z.array(z.number().int().positive())
    .min(1, 'Se requiere al menos un ID de grupo muscular'),

  // Array de instrucciones anidadas
  instructions: z.array(exerciseInstructionSchema)
    .min(1, 'Se requiere al menos un conjunto de instrucciones (por nivel)'),
});