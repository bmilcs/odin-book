import ValidationError from '@/utils/ValidationError';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new ValidationError(errors.array()));
  } else {
    next();
  }
};

export default handleValidationErrors;
