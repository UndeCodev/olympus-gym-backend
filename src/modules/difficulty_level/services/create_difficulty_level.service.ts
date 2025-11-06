import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";
import { CreateDifficultyLevelBody } from "../interfaces/create_difficulty_level_body.interface";
import { DifficultyLevelModel } from "../models/difficulty_level.model";

export const createDifficultyLevelService = async (body: CreateDifficultyLevelBody) => {
  const { name } = body;

  const existingLevel = await DifficultyLevelModel.findByName(name);

  if (existingLevel) {
    throw new AppError({
      httpCode: HttpCode.CONFLICT,
      description: 'Un nivel de dificultad con este nombre ya existe',
    });
  }

  const newDifficultyLevel = await DifficultyLevelModel.create(body);
  return newDifficultyLevel;
};

