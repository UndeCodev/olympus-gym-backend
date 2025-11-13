import { Prisma } from "../../../../generated/prisma";
import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";
import { MasterRoutineParams } from "../interfaces/master_routine_params.interface";
import { MasterRoutineModel } from "../models/master_routine.model";

export const deleteMasterRoutineService = async (params: MasterRoutineParams) => {
  const { id } = params;

  // 1. Validar que la rutina exista
  const existingRoutine = await MasterRoutineModel.findById(id);
  if (!existingRoutine) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Rutina maestra no encontrada',
    });
  }

  // 2. Intentar eliminar
  try {
    await MasterRoutineModel.delete(id);
  } catch (error) {
    // P2003: Foreign key constraint failed (rutina asignada a un usuario)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description: 'No se puede eliminar la rutina porque está asignada a uno o más usuarios.',
      });
    }
    throw error;
  }
};