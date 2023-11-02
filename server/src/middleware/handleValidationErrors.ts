import { ValidationError } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // pass the errors to the errorResponder middleware
    next(new ValidationError(errors.array()));
  } else {
    next();
  }
};

export default handleValidationErrors;
