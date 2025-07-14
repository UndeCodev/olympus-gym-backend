import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";

export const profileRoutes = Router()

profileRoutes.patch('/', ProfileController.updateProfile);