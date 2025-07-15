import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";

export const profileRoutes = Router()

profileRoutes.patch('/update-profile', ProfileController.updateProfile);
profileRoutes.put('/change-password', ProfileController.changePassword);
