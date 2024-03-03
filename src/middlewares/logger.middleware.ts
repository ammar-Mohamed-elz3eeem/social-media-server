import { NextFunction, Request, Response } from "express";
import { logger } from "@/utils/logger";

export default function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.debug(`${req.method}\t${req.headers.origin}\t${req.url}`);
  console.log(`${req.method} ${req.path}`);
  next();
}