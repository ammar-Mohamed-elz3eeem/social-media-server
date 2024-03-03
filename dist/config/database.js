"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    user: process.env.NODE_ENV !== "dev" ? process.env.DB_USER : "ammar",
    password: process.env.NODE_ENV !== "dev" ? process.env.DB_PASS : "158269347",
    host: process.env.NODE_ENV !== "dev" ? process.env.DB_HOST : "localhost",
    port: process.env.NODE_ENV !== "dev" ? process.env.DB_PORT : "5432",
    database: process.env.NODE_ENV !== "dev" ? process.env.DB_NAME : "friendy",
    maxConnections: 20,
    idleTimeoutMillis: 10000
};
