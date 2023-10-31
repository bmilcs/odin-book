import AppError from '@/utils/AppError';
import ValidationError from '@/utils/ValidationError';
import { NextFunction, Request, Response } from 'express';

const errorResponder = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // handle validation errors
  if (err instanceof ValidationError) {
    return res
      .status(err.statusCode)
      .json({ result: err.name, message: err.message, errors: err.errorArray });
  }

  // handle app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      result: err.name,
      message: err.message,
    });
  }

  // handle other errors
  res
    .status(500)
    .json({ result: 'ServerError', message: 'internal server error' });
};

export default errorResponder;
