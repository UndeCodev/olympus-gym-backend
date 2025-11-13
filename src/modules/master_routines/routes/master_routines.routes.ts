import { Router } from 'express';
import { authorize } from '../../auth/middlewares/authorize';
import { MasterRoutinesController } from '../controllers/master_routines.controller';

const masterRoutinesRoutes = Router();

const ManageRoles = ['ADMIN', 'EMPLOYEE'];
const ReadRoles = ['ADMIN', 'EMPLOYEE', 'MEMBER', 'USER'];

masterRoutinesRoutes.post('/', authorize(ManageRoles), MasterRoutinesController.create);

masterRoutinesRoutes.get('/', authorize(ReadRoles), MasterRoutinesController.findAll);

/** GET /:id - Obtener Rutina por ID (Todos) */
masterRoutinesRoutes.get('/:id', authorize(ReadRoles), MasterRoutinesController.findById);

/** PUT /:id - Actualizar Rutina (Gestión) */
masterRoutinesRoutes.put('/:id', authorize(ManageRoles), MasterRoutinesController.update);

/** DELETE /:id - Eliminar Rutina (Gestión) */
masterRoutinesRoutes.delete('/:id', authorize(ManageRoles), MasterRoutinesController.delete);

export default masterRoutinesRoutes;
