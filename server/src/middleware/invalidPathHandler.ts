import { NextFunction, Request, Response } from 'express';

const invalidPathHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ type: 'NotFound', message: 'invalid path' });
};

export default invalidPathHandler;
