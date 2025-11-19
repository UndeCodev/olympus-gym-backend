// src/modules/membershipPlans/routes.ts
import { Router } from 'express';
import { authorize } from '../../auth/middlewares/authorize';
import { MembershipPlanController } from '../controllers/membership_plans.controller';

const membershipPlansRoutes = Router();
const AdminRoles = ['ADMIN', 'EMPLOYEE'];
const PublicRoles = ['ADMIN', 'EMPLOYEE', 'MEMBER', 'USER'];

/** POST / - Crear Plan (Admin) */
membershipPlansRoutes.post('/', authorize(AdminRoles), MembershipPlanController.create);

/** GET / - Listar Planes (Todos los auth) */
membershipPlansRoutes.get('/', authorize(PublicRoles), MembershipPlanController.findAll);

/** GET /:id - Ver detalle (Todos los auth) */
membershipPlansRoutes.get('/:id', authorize(PublicRoles), MembershipPlanController.findById);

/** PUT /:id - Actualizar Plan (Admin) */
membershipPlansRoutes.put('/:id', authorize(AdminRoles), MembershipPlanController.update);

/** DELETE /:id - Desactivar Plan (Admin) */
membershipPlansRoutes.delete('/:id', authorize(AdminRoles), MembershipPlanController.delete);

export default membershipPlansRoutes;
