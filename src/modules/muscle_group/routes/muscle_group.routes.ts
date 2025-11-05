import { Router } from 'express';
import { MuscleGroupController } from '../controllers/muscle_group.controller';
import { authorize } from '../../auth/middlewares/authorize';

export const muscleGroupRoutes = Router();

muscleGroupRoutes.post('/', authorize(['ADMIN', 'EMPLOYEE']), MuscleGroupController.create);

muscleGroupRoutes.get('/', MuscleGroupController.findAll);
muscleGroupRoutes.get('/:id', MuscleGroupController.findById);

muscleGroupRoutes.put('/:id', authorize(['ADMIN', 'EMPLOYEE']), MuscleGroupController.update);

muscleGroupRoutes.delete('/:id', authorize(['ADMIN', 'EMPLOYEE']), MuscleGroupController.delete);
