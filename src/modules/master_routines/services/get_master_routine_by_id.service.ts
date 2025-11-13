import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";
import { MasterRoutineParams } from "../interfaces/master_routine_params.interface";
import { MasterRoutineModel } from "../models/master_routine.model";
import { transformRoutine } from "../utils/transformRoutine";

export const getMasterRoutineByIdService = async (params: MasterRoutineParams) => {
  const routine = await MasterRoutineModel.findById(params.id);

  if (!routine) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Rutina maestra no encontrada',
    });
  }
  // Transformar el string de días en array
  return transformRoutine(routine);
};
