import { rateLimit } from 'express-rate-limit';

const defaultMaxRequests = 5; // 5 requests
const fiveteenMinutes = 15 * 60 * 1000; // 15 minutes

export const createRateLimiter = (maxRequests = defaultMaxRequests, timeWindow = fiveteenMinutes) => {
  return rateLimit({
    windowMs: timeWindow,
    limit: maxRequests,
    message: 'Demasiadas solicitudes. Inténtalo más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};
