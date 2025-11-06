import { Prisma } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { DifficultyLevelParams } from '../interfaces/difficulty_level_params.interface';
import { DifficultyLevelModel } from '../models/difficulty_level.model';

export const deleteDifficultyLevelService = async (params: DifficultyLevelParams) => {
  const { id } = params;

  const existingLevel = await DifficultyLevelModel.findById(id);
  if (!existingLevel) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Nivel de dificultad no encontrado',
    });
  }

  try {
    await DifficultyLevelModel.delete(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description:
          'No se puede eliminar el nivel de dificultad porque está siendo utilizado por uno o más ejercicios.',
      });
    }
    throw error;
  }
};
