import { NextFunction, Request, Response } from 'express';

const invalidPathHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.error('API endpoint not found', 'InvalidPath', 404);
};

export default invalidPathHandler;
