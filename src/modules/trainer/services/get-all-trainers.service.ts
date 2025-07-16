import { TrainerModel } from '../models/trainer.model';

export const getAllTrainersService = async () => {
  const trainers = await TrainerModel.getAllTrainers();
  return trainers;
};
