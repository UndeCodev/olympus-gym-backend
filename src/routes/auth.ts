import { Router } from 'express'
import { AuthController } from '../controllers/auth'

export const authRouter = Router()

authRouter.post('/register', AuthController.createUser)
authRouter.post('/login', AuthController.loginUser)
authRouter.post('/logout', AuthController.logout)
