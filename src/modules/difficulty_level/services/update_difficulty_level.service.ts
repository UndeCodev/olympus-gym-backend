import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { DifficultyLevelParams } from '../interfaces/difficulty_level_params.interface';
import { UpdateDifficultyLevelBody } from '../interfaces/update_difficulty_level_body.interface';
import { DifficultyLevelModel } from '../models/difficulty_level.model';

export const updateDifficultyLevelService = async (params: DifficultyLevelParams, body: UpdateDifficultyLevelBody) => {
  const { id } = params;
  const { name } = body;

  const existingLevel = await DifficultyLevelModel.findById(id);
  if (!existingLevel) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Nivel de dificultad no encontrado',
    });
  }

  const existingName = await DifficultyLevelModel.findByName(name);
  if (existingName && existingName.id !== id) {
    throw new AppError({
      httpCode: HttpCode.CONFLICT,
      description: 'Un nivel de dificultad con este nombre ya existe',
    });
  }

  return await DifficultyLevelModel.update(id, body);
};