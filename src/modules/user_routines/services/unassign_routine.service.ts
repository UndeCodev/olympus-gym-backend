import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { UnassignRoutineParams } from '../interfaces/unassign_routine_params.interface';
import { UserRoutineModel } from '../models/user_routine.model';

export const unassignRoutineService = async (params: UnassignRoutineParams) => {
  const { id } = params;

  // 1. Validar que la asignación exista
  const assignment = await UserRoutineModel.findById(id);

  if (!assignment) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'La asignación de rutina no existe',
    });
  }

  // 2. Eliminar la asignación
  await UserRoutineModel.delete(id);
};
