import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { DifficultyLevelParams } from '../interfaces/difficulty_level_params.interface';
import { DifficultyLevelModel } from '../models/difficulty_level.model';

export const getDifficultyLevelByIdService = async (params: DifficultyLevelParams) => {
  const level = await DifficultyLevelModel.findById(params.id);

  if (!level) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Nivel de dificultad no encontrado',
    });
  }
  return level;
};
