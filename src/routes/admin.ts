import { Router } from 'express'
import * as AdminController from '../controllers/admin'
import { upload } from '../config/multer'

export const adminRouter = Router()

// Email type
adminRouter.post('/config/email-type', AdminController.createEmailType)
adminRouter.get('/config/email-type', AdminController.getAllEmailTypes)

// Company profile
adminRouter.get('/config/company-profile', AdminController.getCompanyProfile)
adminRouter.put('/config/company-profile', upload.single('logo'), AdminController.updateCompanyProfile)
