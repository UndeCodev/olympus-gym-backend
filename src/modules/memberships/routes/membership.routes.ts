import { Router } from 'express';
import { authorize } from '../../auth/middlewares/authorize';
import { MembershipController } from '../controllers/membership.controller';

const membershipRoutes = Router();
const SaleRoles = ['ADMIN', 'EMPLOYEE'];
const MemberRoles = ['MEMBER', 'USER'];
const AdminRoles = ['ADMIN', 'EMPLOYEE'];

membershipRoutes.get('/my-status', authorize(MemberRoles), MembershipController.getMyStatus);
membershipRoutes.get('/user/:userId', authorize(AdminRoles), MembershipController.getUserHistory);

membershipRoutes.post('/assign', authorize(SaleRoles), MembershipController.assign);
membershipRoutes.post('/renew', authorize(AdminRoles), MembershipController.renew);
membershipRoutes.post('/cancel', authorize(AdminRoles), MembershipController.cancel);

export default membershipRoutes;
