import { tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const getFeed = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('get feed');
});

export default {
  getFeed,
};
