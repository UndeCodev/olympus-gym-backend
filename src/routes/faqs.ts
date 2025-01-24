import { Router } from 'express'
import { FaqsController } from '../controllers/faqs'

export const faqsRouter = Router()

faqsRouter.get('/', FaqsController.getFaqs)
faqsRouter.get('/getFaqsRange', FaqsController.getFaqsRange)
faqsRouter.post('/create', FaqsController.createFaq)
faqsRouter.put('/update/:id', FaqsController.updateFaq)
