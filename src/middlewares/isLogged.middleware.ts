import auth from "@/config/auth";
import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { UserReq } from "./verifyJWT.middleware";

export default function isLoggedIn(req: UserReq, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.headers.Authorization as string;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, auth.access_secret, (err: VerifyErrors | null, decoded: any) => {
    console.log(token);
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });    //invalid token
    }
    req.user = decoded.id;
    next();
  });
};