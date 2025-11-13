import { Request, Response } from 'express';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { markExerciseSchema } from '../schemas/exercise_log.schema';
import { markExerciseService } from '../services/mark_exercise.service';

export class ExerciseLogController {
  static async mark(req: Request, res: Response) {
    const userId = res.locals.user;

    console.log({ userId, req });

    // 2. Validar 'body'
    const body = await validateSchema(markExerciseSchema, req.body);

    // 3. Llamar al servicio funcional
    const log = await markExerciseService(userId!, body);

    // 4. Devolver respuesta
    res.status(HttpCode.OK).json({
      // 200 OK (o 201 si es nuevo)
      message: log.completed ? 'Ejercicio marcado como completado' : 'Ejercicio marcado como no completado',
      data: log,
    });
  }
}
