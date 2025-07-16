import { Router } from 'express';
import { TrainersController } from '../controllers/trainer.controller';
import { authorize } from '../../auth/middlewares/authorize';
import { authenticate } from '../../auth/middlewares/authenticate';
import { requireAuth } from '../../auth/middlewares/requireAuth';

export const trainerRoutes = Router();

trainerRoutes.get('/search', authenticate, requireAuth, authorize(['ADMIN']), TrainersController.searchEmployeeByNameOrEmail);
trainerRoutes.get('/', authenticate, requireAuth, authorize(['ADMIN']), TrainersController.getAllTrainers);

trainerRoutes.post('/', authenticate, requireAuth, authorize(['ADMIN']), TrainersController.createTrainer);
trainerRoutes.patch('/:id', authenticate, requireAuth, authorize(['ADMIN']), TrainersController.updateTrainerById);
trainerRoutes.delete('/:id', authenticate, requireAuth, authorize(['ADMIN']), TrainersController.deleteTrainerById);
