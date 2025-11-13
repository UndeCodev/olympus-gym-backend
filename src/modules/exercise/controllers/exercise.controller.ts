import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import {
  createExerciseSchema,
  getDeleteExerciseSchema,
  getExercisesSchema,
  updateExerciseSchema,
} from '../schemas/exercise.schema';
import { createExerciseService } from '../services/create_exercise.service';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { getExercisesService } from '../services/get_exercises.service';
import { getExerciseByIdService } from '../services/get_exercise_by_id.service';
import { updateExerciseService } from '../services/update_exercise.service';
import { deleteExerciseService } from '../services/delete_exercise.service';

export class ExerciseController {
  static async create(req: Request, res: Response) {
    const body = await validateSchema(createExerciseSchema, req.body);
    const newExercise = await createExerciseService(body);

    res.status(HttpCode.CREATED).json({
      message: 'Ejercicio creado exitosamente',
      data: newExercise,
    });
  }

  static async findAll(req: Request, res: Response) {
    const { query } = await validateSchema(getExercisesSchema, req);
    const exercises = await getExercisesService(query);

    res.status(HttpCode.OK).json({
      message: 'Ejercicios obtenidos exitosamente',
      data: exercises,
    });
  }

  static async findById(req: Request, res: Response) {
    const { params } = await validateSchema(getDeleteExerciseSchema, req);
    const exercise = await getExerciseByIdService(params);

    res.status(HttpCode.OK).json({
      message: 'Ejercicio obtenido exitosamente',
      data: exercise,
    });
  }

  static async update(req: Request, res: Response) {
    const validated = await validateSchema(updateExerciseSchema, {
      params: req.params,
      body: req.body,
    });

    const updatedExercise = await updateExerciseService(validated.params, validated.body);

    res.status(HttpCode.OK).json({
      message: 'Ejercicio actualizado exitosamente',
      data: updatedExercise,
    });
  }

  static async delete(req: Request, res: Response) {
    const { params } = await validateSchema(getDeleteExerciseSchema, req);
    await deleteExerciseService(params);

    res.status(HttpCode.OK).json({
      message: 'Ejercicio eliminado exitosamente',
    });
  }
}
