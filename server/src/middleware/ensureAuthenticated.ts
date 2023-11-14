import { AppError } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isAuthenticated = req.userId;
  if (isAuthenticated) {
    return next();
  }

  next(new AppError('Unauthorized', 401));
};

export default ensureAuthenticated;
