import dotenv from 'dotenv';
dotenv.config();

export default {
  user: process.env.NODE_ENV !== "dev" ? process.env.DB_USER : "ammar",
  password: process.env.NODE_ENV !== "dev" ? process.env.DB_PASS : "158269347",
  host: process.env.NODE_ENV !== "dev" ? process.env.DB_HOST : "localhost",
  port: process.env.NODE_ENV !== "dev" ? process.env.DB_PORT : "5432",
  database: process.env.NODE_ENV !== "dev" ? process.env.DB_NAME: "friendy",
  maxConnections: 20,
  idleTimeoutMillis: 10000
};