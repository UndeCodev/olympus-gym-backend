import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import {
  createDifficultyLevelSchema,
  getDeleteDifficultyLevelSchema,
  getDifficultyLevelsSchema,
  updateDifficultyLevelSchema,
} from '../schemas/difficulty_level.schema';
import { createDifficultyLevelService } from '../services/create_difficulty_level.service';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { getDifficultyLevelsService } from '../services/get_difficulty_level.service';
import { getDifficultyLevelByIdService } from '../services/get_difficulty_level_by_id.service';
import { updateDifficultyLevelService } from '../services/update_difficulty_level.service';
import { deleteDifficultyLevelService } from '../services/delete_difficulty_level.service';

export class DifficultyLevelController {
  static async create(req: Request, res: Response) {
    const body = await validateSchema(createDifficultyLevelSchema, req.body);

    const newDifficultyLevel = await createDifficultyLevelService(body);

    res.status(HttpCode.CREATED).json({
      message: 'Nivel de dificultad creado exitosamente',
      data: newDifficultyLevel,
    });
  }

  static async findAll(req: Request, res: Response) {
    const query = await validateSchema(getDifficultyLevelsSchema, req.query);
    const levels = await getDifficultyLevelsService(query);

    res.status(HttpCode.OK).json({
      message: 'Niveles de dificultad obtenidos exitosamente',
      data: levels,
    });
  }

  static async findById(req: Request, res: Response) {
    const params = await validateSchema(getDeleteDifficultyLevelSchema, req.params);
    const level = await getDifficultyLevelByIdService(params);

    res.status(HttpCode.OK).json({
      message: 'Nivel de dificultad obtenido exitosamente',
      data: level,
    });
  }

  static async update(req: Request, res: Response) {
    const validated = await validateSchema(updateDifficultyLevelSchema, {
      params: req.params,
      body: req.body,
    });

    const updatedLevel = await updateDifficultyLevelService(validated.params, validated.body);

    res.status(HttpCode.OK).json({
      message: 'Nivel de dificultad actualizado exitosamente',
      data: updatedLevel,
    });
  }

  static async delete(req: Request, res: Response) {
    const params = await validateSchema(getDeleteDifficultyLevelSchema, req.params);
    await deleteDifficultyLevelService(params);

    res.status(HttpCode.OK).json({
      message: 'Nivel de dificultad eliminado exitosamente',
    });
  }
}
