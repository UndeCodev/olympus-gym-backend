import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { CreateMuscleGroupInput } from '../interfaces/create_muscle_group_input.interface';
import { MuscleGroupModel } from '../models/muscle_group.model';

export const createMuscleGroupService = async (data: CreateMuscleGroupInput) => {
  const existingGroup = await MuscleGroupModel.findByName(data.name);

  if (existingGroup) {
    throw new AppError({
      httpCode: HttpCode.CONFLICT,
      description: `El grupo muscular ${data.name} ya se encuentra registrado.`,
    });
  }

  const newMuscleGroup = await MuscleGroupModel.create(data);

  return newMuscleGroup;
};
