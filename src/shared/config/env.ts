process.loadEnvFile();

export const {
  APP_ORIGIN,
  PORT = 3000,
  NODE_ENV = 'development',
  DATABASE_URL,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  NODEMAILER_USER,
  NODEMAILER_PASS,
} = process.env;
