import { AppError } from '../../../core/errors/AppError';
import { UpdateTrainerData } from '../interfaces/updateTrainer.interface';
import { TrainerModel } from '../models/trainer.model';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

export const updateTrainerService = async (trainerId: number, trainerData: UpdateTrainerData) => {
  if (Object.keys(trainerData).length === 0) {
    throw new AppError({
      httpCode: HttpCode.BAD_REQUEST,
      description: 'No se proporcionaron datos para actualizar el entrenador',
    });
  }

  const trainerFound = await TrainerModel.getTrainerById(trainerId);

  if (!trainerFound) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'No se encontró el entrenador especificado',
    });
  }

  const trainerUpdated = await TrainerModel.updateTrainer(trainerId, trainerData);

  return trainerUpdated;
};
