import cors from 'cors';

const ACCPETED_ORIGINS = ['http://localhost:3000', 'http://localhost:5173'];

export const corsMiddleware = ({ acceptedOrigins = ACCPETED_ORIGINS } = {}) =>
  cors({
    origin: (origin, cb) => {
      if (acceptedOrigins.includes(origin!)) {
        return cb(null, true);
      }

      if (!origin) {
        return cb(null, true);
      }

      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
