import cors from 'cors';

const ACCPETED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://olympus-gym-atlapexco.com',
  'https://peppy-taiyaki-e15cc2.netlify.app',
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
