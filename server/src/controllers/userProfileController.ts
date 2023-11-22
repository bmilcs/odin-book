import { tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const getProfile = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('get profile');
  },
);

const updateProfile = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('update profile');
  },
);

export default {
  getProfile,
  updateProfile,
};
