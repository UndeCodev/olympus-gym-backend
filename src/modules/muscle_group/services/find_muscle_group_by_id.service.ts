import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { GetMuscleGroupByIdParams } from '../interfaces/get_muscle_group_by_id_params.interface';
import { MuscleGroupModel } from '../models/muscle_group.model';

export const findMuscleGroupByIdService = async (params: GetMuscleGroupByIdParams) => {
  const muscleGroup = await MuscleGroupModel.findById(params.id);

  if (!muscleGroup) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Grupo muscular no encontrado',
    });
  }

  return muscleGroup;
};
