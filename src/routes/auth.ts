import { Router } from 'express'
import * as AuthController from '../controllers/auth'

export const authRouter = Router()

authRouter.post('/register', AuthController.createUser)
authRouter.post('/login', AuthController.loginUser)
authRouter.post('/logout', AuthController.logout)

authRouter.post('/resend-verification-email', AuthController.resendVerificationEmail)
authRouter.post('/send-forgot-password-email', AuthController.sendForgotPasswordEmail)

authRouter.post('/reset-password', AuthController.resetPassword)
