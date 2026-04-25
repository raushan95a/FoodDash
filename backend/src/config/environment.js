const dotenv = require('dotenv');

dotenv.config();

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  corsOrigins,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || 'fooddash',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10)
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'development_secret_change_me_32_chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 10)
};

module.exports = env;
