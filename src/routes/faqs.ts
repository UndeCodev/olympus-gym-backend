import { Router } from 'express'
import { FaqsController } from '../controllers/faqs'

export const faqsRouter = Router()

faqsRouter.get('/', FaqsController.getAllFaqs)
faqsRouter.get('/getFaqsInRange', FaqsController.getFaqsInRange)
faqsRouter.post('/createFaq', FaqsController.createFaq)
faqsRouter.put('/updateFaq/:id', FaqsController.updateFaq)
