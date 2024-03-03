import dotenv from 'dotenv';
dotenv.config();

export default {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  maxConnections: 20,
  idleTimeoutMillis: 10000
};