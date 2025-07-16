import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { createTrainerService } from '../services/createTrainer.service';
import { getAllTrainersService } from '../services/get-all-trainers.service';
import {
  createTrainerSchema,
  idTrainerSchema,
  searchEmployeeSchema,
  updateTrainerSchema,
} from '../schemas/trainer.schema';
import { updateTrainerService } from '../services/updateTrainer.service';
import { searchEmployees } from '../services/searchEmployees.service';
import { deleteTrainerService } from '../services/delete-trainer.service';

export class TrainersController {
  static async createTrainer(req: Request, res: Response) {
    const { firstName, lastName, phoneNumber, email, password, isActive, birthDate } = await validateSchema(
      createTrainerSchema,
      req.body,
    );

    const trainerCreated = await createTrainerService({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      isActive,
      birthDate,
    });

    res.status(HttpCode.CREATED).json({ trainerCreated });
  }

  static async getAllTrainers(_: Request, res: Response) {
    const trainers = await getAllTrainersService();

    res.json({ trainers });
  }

  static async searchEmployeeByNameOrEmail(req: Request, res: Response) {
    const { term, page, pageSize, isActive } = await validateSchema(searchEmployeeSchema, req.query);


    const employees = await searchEmployees({ term, page, pageSize, isActive });

    res.json(employees);
  }

  static async updateTrainerById(req: Request, res: Response) {
    const { id } = await validateSchema(idTrainerSchema, req.params);
    const { firstName, lastName, phoneNumber, birthDate, email, password, isActive } = await validateSchema(
      updateTrainerSchema,
      req.body,
    );

    const updatedTrainer = await updateTrainerService(id, {
      firstName,
      lastName,
      phoneNumber,
      birthDate,
      email,
      password,
      isActive,
    });

    res.json({
      trainer: updatedTrainer,
    });
  }

  static async deleteTrainerById(req: Request, res: Response) {
    const { id } = await validateSchema(idTrainerSchema, req.params);

    await deleteTrainerService(id);

    res.sendStatus(HttpCode.NO_CONTENT);
  }
}
