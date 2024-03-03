import authConfig from '@/config/auth';
import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

export interface UserReq extends Request {
  user?: string;
}

export const verifyJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization || req.headers.Authorization as string;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, authConfig.access_secret, (err: VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });    //invalid token
    }
    req.user = decoded.id;
    next();
  });
}
