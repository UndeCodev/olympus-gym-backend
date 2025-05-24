import { Request, Response } from 'express';
import { createUserSchema } from '../../auth/schemas/auth.schemas';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { createTrainerService } from '../services/createTrainer.service';
import { getAllTrainersService } from '../services/getAllTrainers.service';
import { idTrainerSchema, updateTrainerSchema } from '../schemas/trainer.schema';
import { updateTrainerService } from '../services/updateTrainer.service';

export class TrainersController {
  static async createTrainer(req: Request, res: Response) {
    const trainerData = await validateSchema(createUserSchema, req.body);

    const trainerCreated = await createTrainerService(trainerData);

    res.status(HttpCode.CREATED).json({ trainerCreated });
  }

  static async getAllTrainers(_: Request, res: Response) {
    const trainers = await getAllTrainersService();

    res.json({ trainers });
  }

  static async updateTrainerById(req: Request, res: Response) {
    const { id } = await validateSchema(idTrainerSchema, req.params);
    const trainerData = await validateSchema(updateTrainerSchema, req.body);

    const updatedTrainer = await updateTrainerService(id, trainerData);

    res.json({
      trainer: updatedTrainer,
    });
  }
}
