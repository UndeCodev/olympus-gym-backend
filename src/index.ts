import express, { Response, Request } from 'express'

import { PORT } from './config/config'
import { authRouter } from './routes/auth'
import { errorHandlerMiddleware } from './middlewares/errorHandler'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './middlewares/cors'
import { adminRouter } from './routes/admin'
import { profileRouter } from './routes/profile'

const app = express()

app.disable('x-powered-by')

app.use(express.json())
app.use(cookieParser())
app.use(corsMiddleware())

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World')
})

// Routes
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/profile', profileRouter)

app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
