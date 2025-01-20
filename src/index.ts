import express, { Response, Request } from 'express'

import { PORT } from './config/config'
import { authRouter } from './routes/auth'
import { errorHandlerMiddleware } from './middlewares/errorHandler'
import cookieParser from 'cookie-parser'
import { verifyToken } from './middlewares/verifyToken'
import { corsMiddleware } from './middlewares/cors'

const app = express()

app.disable('x-powered-by')

app.use(express.json())
app.use(cookieParser())
app.use(corsMiddleware())

app.get('/', verifyToken, async (_req: Request, res: Response) => {
  res.send('Hello World')
})

// Routes
app.use('/api/auth', authRouter)

app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
