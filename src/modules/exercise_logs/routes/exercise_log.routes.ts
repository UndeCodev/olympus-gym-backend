import { Router } from 'express';
import { authorize } from '../../auth/middlewares/authorize';
import { ExerciseLogController } from '../controllers/exercise_log.controller';

const exerciseLogRoutes = Router();

const MemberRoles = ['MEMBER', 'USER'];

exerciseLogRoutes.post('/', authorize(MemberRoles), ExerciseLogController.mark);

export default exerciseLogRoutes;
