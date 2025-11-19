import { Router } from 'express';
import { authorize } from '../../auth/middlewares/authorize';
import { AccessControlController } from '../controllers/access_control.controller';

const accessControlRoutes = Router();
const GuardRoles = ['ADMIN', 'EMPLOYEE'];

accessControlRoutes.post('/validate-qr', authorize(GuardRoles), AccessControlController.validate);

export default accessControlRoutes;
