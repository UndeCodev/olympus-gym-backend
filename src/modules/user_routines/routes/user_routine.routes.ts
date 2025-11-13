import { Router } from 'express';
import { authorize } from '../../auth/middlewares/authorize';
import { UserRoutineController } from '../controllers/user_routine.controller';

const userRoutinesRoutes = Router();
const ManageRoles = ['ADMIN', 'EMPLOYEE'];

userRoutinesRoutes.post('/assign', authorize(ManageRoles), UserRoutineController.assign);

userRoutinesRoutes.get('/user/:userId', authorize(ManageRoles), UserRoutineController.getForUser);

userRoutinesRoutes.delete('/:id', authorize(ManageRoles), UserRoutineController.unassign);

export default userRoutinesRoutes;
