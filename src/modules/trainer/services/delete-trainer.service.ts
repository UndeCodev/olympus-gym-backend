import { TrainerModel } from "../models/trainer.model";

export const deleteTrainerService = async (trainerId: number) => {
  await TrainerModel.deleteTrainerById(trainerId);
};