import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { UpdateMuscleGroupBody } from '../interfaces/update_muscle_group_body.interface';
import { UpdateMuscleGroupParams } from '../interfaces/update_muscle_group_params.interface';
import { MuscleGroupModel } from '../models/muscle_group.model';

export const updateMuscleGroupService = async (params: UpdateMuscleGroupParams, body: UpdateMuscleGroupBody) => {
  const { id } = params;
  const { name } = body;

  const existingGroup = await MuscleGroupModel.findById(id);
  if (!existingGroup) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Grupo muscular no encontrado',
    });
  }

  const existingName = await MuscleGroupModel.findByName(name);
  if (existingName && existingName.id !== id) {
    throw new AppError({
      httpCode: HttpCode.CONFLICT,
      description: 'Un grupo muscular con este nombre ya existe',
    });
  }

  const updatedMuscleGroup = await MuscleGroupModel.update(id, body);
  return updatedMuscleGroup;
};
