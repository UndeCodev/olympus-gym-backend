import { Request, Response } from 'express';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { getMyRoutineSchema } from '../schemas/my_routine.schema';
import { getMyRoutineService } from '../services/get_my_routine.service';

export class MyRoutineController {
  static async get(req: Request, res: Response) {
    if (!res.locals.user || !res.locals.user.id || !res.locals.user.difficultyLevelId) {
      res.status(HttpCode.UNAUTHORIZED).json({
        message: 'No autenticado o el token no incluye el nivel de dificultad.',
      });
      return;
    }

    const { id: userId, difficultyLevelId } = res.locals.user;

    const { query } = await validateSchema(getMyRoutineSchema, req);

    const routineData = await getMyRoutineService(userId, difficultyLevelId, query);

    res.status(HttpCode.OK).json({
      message: 'Rutinas del usuario obtenidas exitosamente',
      data: routineData,
    });
  }
}
