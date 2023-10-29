import { tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const getProfile = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('get profile');
});

const updateProfile = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('update profile');
});

export default {
  getProfile,
  updateProfile,
};
