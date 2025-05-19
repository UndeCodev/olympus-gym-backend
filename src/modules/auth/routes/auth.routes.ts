import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate';
import { createRateLimiter } from '../../../shared/utils/rateLimit';

export const authRoutes = Router();

const authLimiter = createRateLimiter(3);

authRoutes.post('/register', AuthController.register);
authRoutes.post('/login', AuthController.login);
authRoutes.post('/logout', AuthController.logout);

authRoutes.get('/me', authenticate, AuthController.getCurrentUser);
authRoutes.get('/refresh', AuthController.refreshToken);

// Rate limit to 3 requests per 15 minute
authRoutes.post('/send-verification-email', authLimiter, AuthController.sendVerificationEmail);
authRoutes.get('/verify-email/:token', AuthController.verifyEmail);

// Rate limit to 3 requests per 15 minute
authRoutes.post('/request-password-reset', authLimiter, AuthController.requestPasswordReset);
authRoutes.put('/reset-password', AuthController.resetPassword);

authRoutes.put('/change-password', authenticate, AuthController.changePassword);
