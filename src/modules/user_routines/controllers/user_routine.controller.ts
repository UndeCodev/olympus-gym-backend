import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { assignRoutineService } from '../services/assign_routine.service';
import {
  assignRoutineSchema,
  getAssignmentsForUserSchema,
  unassignRoutineSchema,
} from '../schemas/user_routine.schema';
import { getAssignmentsForUserService } from '../services/get_assignments_for_user.service';
import { unassignRoutineService } from '../services/unassign_routine.service';

export class UserRoutineController {
  static async assign(req: Request, res: Response) {
    const body = await validateSchema(assignRoutineSchema, req.body);

    const newAssignment = await assignRoutineService(body);

    res.status(HttpCode.CREATED).json({
      message: 'Rutina asignada al usuario exitosamente',
      data: newAssignment,
    });
  }

  static async getForUser(req: Request, res: Response) {
    const { params } = await validateSchema(getAssignmentsForUserSchema, req);
    const assignments = await getAssignmentsForUserService(params as { userId: number });

    res.status(HttpCode.OK).json({
      message: 'Asignaciones obtenidas exitosamente',
      data: assignments,
    });
  }

  /**
   * Manejador para desasignar (eliminar) una asignación de rutina.
   */
  static async unassign(req: Request, res: Response) {
    const { params } = await validateSchema(unassignRoutineSchema, req);
    await unassignRoutineService(params as { id: number });

    res.status(HttpCode.OK).json({
      message: 'Rutina desasignada exitosamente',
    });
  }
}
