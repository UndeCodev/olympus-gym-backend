import { Router } from 'express';
import { TrainersController } from '../controllers/trainer.controller';
import { authorize } from '../../auth/middlewares/authorize';
import { authenticate } from '../../auth/middlewares/authenticate';

export const trainerRoutes = Router();

trainerRoutes.post('/', authenticate, authorize(['ADMIN']), TrainersController.createTrainer);
trainerRoutes.get('/', authenticate, authorize(['ADMIN']), TrainersController.getAllTrainers);
