import { Router } from 'express';
import { authorize } from '../../auth/middlewares/authorize';
import { MyRoutineController } from '../controllers/my_routine.controller';
import { requireMembership } from '../../memberships/middlewares/requireMembership.middleware';

const myRoutineRoutes = Router();
const MemberRoles = ['MEMBER', 'USER'];

myRoutineRoutes.get('/', authorize(MemberRoles), requireMembership, MyRoutineController.get);

export default myRoutineRoutes;
