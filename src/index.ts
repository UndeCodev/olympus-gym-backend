import express, { Response, Request, NextFunction } from 'express'
import cookieParser from 'cookie-parser'

import { PORT } from './config/config'
import { authRouter } from './routes/auth'
import { errorHandler } from './exceptions/ErrorHandler'
import { AppError } from './exceptions/AppError'

const app = express()

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRouter)

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World')
})

app.use((err: Error | AppError, _req: Request, response: Response, next: NextFunction) => {
  errorHandler.handleError(err, response)
  next()
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
