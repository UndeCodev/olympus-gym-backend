process.loadEnvFile()

export const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  JWT_SECRET,
  NODE_ENV = 'development'
} = process.env
