import { Prisma } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { DeleteMuscleGroupParams } from '../interfaces/delete_muscle_group_params.interface';
import { MuscleGroupModel } from '../models/muscle_group.model';

export const deleteMuscleGroupService = async (params: DeleteMuscleGroupParams) => {
  const { id } = params;

  const existingGroup = await MuscleGroupModel.findById(id);
  if (!existingGroup) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Grupo muscular no encontrado',
    });
  }

  try {
    await MuscleGroupModel.delete(id);
  } catch (error) {
    // Error P2003: "Foreign key constraint failed" (El grupo está en uso)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description: 'No se puede eliminar el grupo muscular porque está siendo utilizado por uno o más ejercicios.',
      });
    }
    
    // Lanzar otros errores inesperados
    throw error;
  }
};
