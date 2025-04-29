import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../../../shared/middlewares/authenticate';

export const authRoutes = Router();

authRoutes.post('/register', AuthController.register);
authRoutes.post('/login', AuthController.login);
authRoutes.get('/logout', AuthController.logout);

authRoutes.get('/me', authenticate, AuthController.authMe);
