import { PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { CreateExerciseBody } from '../interfaces/create_exercise_body.interface';
import { ExerciseModel } from '../models/exercise.model';

const prisma = new PrismaClient();

export const createExerciseService = async (body: CreateExerciseBody) => {
  const { name, muscleGroupIds, instructions } = body;

  // 1. Validar nombre duplicado
  const existingExercise = await ExerciseModel.findByName(name);
  if (existingExercise) {
    throw new AppError({
      httpCode: HttpCode.CONFLICT,
      description: 'Ya existe un ejercicio con este nombre',
    });
  }

  // 2. Validar que todos los MuscleGroup IDs existan
  const muscleGroups = await prisma.muscle_group.findMany({
    where: { id: { in: muscleGroupIds } },
  });
  if (muscleGroups.length !== muscleGroupIds.length) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Uno o más IDs de Grupos Musculares no son válidos',
    });
  }

  // 3. Validar que todos los DifficultyLevel IDs existan
  const difficultyLevelIds = instructions.map((i) => i.difficultyLevelId);
  const difficultyLevels = await prisma.difficulty_level.findMany({
    where: { id: { in: difficultyLevelIds } },
  });
  if (difficultyLevels.length !== difficultyLevelIds.length) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'Uno o más IDs de Nivel de Dificultad no son válidos',
    });
  }

  // 4. Llamar al modelo para la transacción
  return await ExerciseModel.create(body);
};
