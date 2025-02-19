import { Router } from 'express'

import * as ProfileController from '../controllers/profile'
import authenticateMiddleware from '../middlewares/authenticateMiddleware'

export const profileRouter = Router()

profileRouter.post('/change-password', authenticateMiddleware, ProfileController.changePassword)
