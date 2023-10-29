import { NextFunction, Request, Response } from 'express';

const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error({ err });
  next(err);
};

export default errorLogger;
