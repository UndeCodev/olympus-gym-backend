import express from 'express';
import morgan from 'morgan';
import { PORT } from './shared/config/env';
import router from './shared/routes';
import { errorHandlerMiddleware } from './shared/middlewares/errorHandler';
import { corsMiddleware } from './shared/middlewares/cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(corsMiddleware());
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/healthcheck', (_, res) => {
  res.send('API is up and running');
});

app.use('/api', router);

app.use(errorHandlerMiddleware);

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
