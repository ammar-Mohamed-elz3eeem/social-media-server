import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';
import loggerMiddleware from '@/middlewares/logger.middleware';
import credentials from '@/middlewares/credentials.middleware';
import errorHandler from '@/middlewares/error.middleware';
import { verifyJWT } from '@/middlewares/verifyJWT.middleware';
import corsOptions from '@/config/cors';
import usersRoute from '@/routes/user.route';
import logoutRoute from '@/routes/logout.route';
import authRoute from '@/routes/auth.route';
import Postsroute from '@/routes/post.route';
import imageRoute from '@/routes/image.route';

const app = express();
const PORT = process.env.PORT || 5000;
export const UPLOAD_PATH = path.join(__dirname, "..", "uploads");
export const AVATAR_PATH = path.join(__dirname, "..", "avatars");

app.use(loggerMiddleware);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/users", usersRoute);
app.use("/login", authRoute);
app.use("/logout", logoutRoute);
app.use("/posts", Postsroute);
app.use("/images", imageRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({message: "Welcome to Friendy Server"});
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({message: '404 Not Found'});
});

app.use(errorHandler);

// if (!process.env.TEST_ENV) {
app.listen(PORT, () => {
  console.log('app is running on port: ', PORT);
});
// }

export default app;
