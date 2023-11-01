import { AppError, ValidationError } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const errorResponder = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // handle validation errors
  if (err instanceof ValidationError) {
    return res.error(err.name, err.errorArray, err.statusCode);
  }

  // handle app errors
  if (err instanceof AppError) {
    return res.error(err.name, err.message, err.statusCode);
  }

  // handle other errors
  return res.error('ServerError', err.message, 500);
};

export default errorResponder;
