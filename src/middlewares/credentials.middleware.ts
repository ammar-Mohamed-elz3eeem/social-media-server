import origins from '@/config/allowedOrigins';
import { NextFunction, Request, Response } from 'express';

export default function credentials(
  req: any,
  res: any,
  next: any
) {
  const origin = req.headers.origin as string;
  if (origins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
}
