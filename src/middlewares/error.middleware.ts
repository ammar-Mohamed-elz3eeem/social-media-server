import { logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.name}: ${err.message}`);
  res.status(500).send(err.message);
}

export default errorHandler;
