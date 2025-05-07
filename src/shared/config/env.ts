process.loadEnvFile();

export const { NODE_ENV = 'development', PORT = 3000, JWT_SECRET_ACCESS, JWT_SECRET_REFRESH } = process.env;
