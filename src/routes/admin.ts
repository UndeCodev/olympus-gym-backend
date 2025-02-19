import { Router } from 'express'
import * as AdminController from '../controllers/admin'

export const adminRouter = Router()

adminRouter.post('/config/email-type', AdminController.createEmailType)
adminRouter.get('/config/email-type', AdminController.getAllEmailTypes)
