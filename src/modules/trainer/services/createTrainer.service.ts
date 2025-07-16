import { CreateTrainer } from '../interfaces/create-trainer.interface';
import { TrainerModel } from '../models/trainer.model';

export const createTrainerService = async (trainerData: CreateTrainer) => {
  const trainerCreated = await TrainerModel.createTrainer(trainerData);

  return trainerCreated;
};
