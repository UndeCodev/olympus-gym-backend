import { Router } from 'express';
import { authorize } from '../../auth/middlewares/authorize';
import { DifficultyLevelController } from '../controllers/difficulty_level.controller';

export const difficultyLevelRoutes = Router();

const ManageRoles = ['ADMIN', 'EMPLOYEE'];

difficultyLevelRoutes.post('/', authorize(ManageRoles), DifficultyLevelController.create);

difficultyLevelRoutes.get('/', DifficultyLevelController.findAll);
difficultyLevelRoutes.get('/:id', DifficultyLevelController.findById);

difficultyLevelRoutes.put('/:id', authorize(ManageRoles), DifficultyLevelController.update);

difficultyLevelRoutes.delete('/:id', authorize(ManageRoles), DifficultyLevelController.delete);
