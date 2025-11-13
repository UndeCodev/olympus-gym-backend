import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import upload from '../../../shared/config/multer';

export const profileRoutes = Router();

profileRoutes.post('/upload-profile-picture', upload.single('profilePicture'), ProfileController.uploadProfilePicture);
profileRoutes.patch('/update-profile', ProfileController.updateProfile);
profileRoutes.put('/change-password', ProfileController.changePassword);
