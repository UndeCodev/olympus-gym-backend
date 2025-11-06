import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { createExerciseSchema } from '../schemas/exercise.schema';
import { createExerciseService } from '../services/create_exercise.service';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

export class ExerciseController {
  static async create(req: Request, res: Response) {
    const body = await validateSchema(createExerciseSchema, req.body);
    const newExercise = await createExerciseService(body);

    res.status(HttpCode.CREATED).json({
      message: 'Ejercicio creado exitosamente',
      data: newExercise,
    });
  }
}