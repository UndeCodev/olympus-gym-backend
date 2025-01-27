import express, { Response, Request } from 'express'

import { PORT } from './config/config'
import { authRouter } from './routes/auth'
import { errorHandlerMiddleware } from './middlewares/errorHandler'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './middlewares/cors'
import { adminRouter } from './routes/admin'
import { sendEmail } from './services/mailService'

const app = express()

app.disable('x-powered-by')

app.use(express.json())
app.use(cookieParser())
app.use(corsMiddleware())

app.get('/', async (_req: Request, res: Response) => {
  res.send('Hello World')
})

app.post('/email-test', async (_req: Request, res: Response) => {
  const resEmail = await sendEmail('validateEmail', 'koxib71232@fanicle.com')

  res.json({
    resEmail
  })
})

// Routes
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)

app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
