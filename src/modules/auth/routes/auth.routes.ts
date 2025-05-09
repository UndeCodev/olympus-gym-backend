import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../../../shared/middlewares/authenticate';

export const authRoutes = Router();

authRoutes.post('/register', AuthController.register);
authRoutes.post('/login', AuthController.login);
authRoutes.post('/logout', AuthController.logout);

authRoutes.get('/me', authenticate, AuthController.getCurrentUser);
authRoutes.get('/refresh', AuthController.refreshToken);

authRoutes.post('/send-verification-email', AuthController.sendVerificationEmail);
authRoutes.get('/verify-email/:token', AuthController.verifyEmail);
