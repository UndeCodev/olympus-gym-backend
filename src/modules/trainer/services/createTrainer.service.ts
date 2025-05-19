import { User } from '../../../core/entities/User';
import { TrainerModel } from '../models/trainer.model';

export const createTrainerService = async (trainerData: User) => {
  const trainerCreated = await TrainerModel.createTrainer(trainerData);

  return trainerCreated;
};
