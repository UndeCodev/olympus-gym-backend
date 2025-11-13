import { Router } from "express";
import { authorize } from "../../auth/middlewares/authorize";
import { ExerciseController } from "../controllers/exercise.controller";

export const exerciseRoutes = Router();

const ManageRoles = ['ADMIN', 'EMPLOYEE'];

exerciseRoutes.post('/', authorize(ManageRoles), ExerciseController.create)

exerciseRoutes.get('/', ExerciseController.findAll)
exerciseRoutes.get('/:id', ExerciseController.findById)

exerciseRoutes.put('/:id', authorize(ManageRoles), ExerciseController.update)

exerciseRoutes.delete('/:id', authorize(ManageRoles), ExerciseController.delete)