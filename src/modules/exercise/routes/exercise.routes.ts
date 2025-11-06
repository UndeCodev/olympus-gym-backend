import { Router } from "express";
import { authorize } from "../../auth/middlewares/authorize";
import { ExerciseController } from "../controllers/exercise.controller";

export const exerciseRoutes = Router();

const ManageRoles = ['ADMIN', 'EMPLOYEE'];

exerciseRoutes.post('/', authorize(ManageRoles), ExerciseController.create)