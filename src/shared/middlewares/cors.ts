import cors from 'cors';

const ACCPETED_ORIGINS = [
  'http://localhost:5173',
  'https://olympus-gym-atlapexco.com',
  'https://b69f2ed1248f.ngrok-free.app',
  'https://alexa.amazon.com',
  'https://developer.amazon.com',
];

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
