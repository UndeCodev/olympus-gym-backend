process.loadEnvFile();

export const { NODE_ENV = 'development', PORT = 3000, JWT_SECRET } = process.env;
