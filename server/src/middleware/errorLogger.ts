import { ValidationError } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!(err instanceof ValidationError)) {
    console.error({ err });
  }
  next(err);
};

export default errorLogger;
