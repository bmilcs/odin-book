import { tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const signup = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('signup');
});

const login = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('login');
});

const logout = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('logout');
});

export default {
  signup,
  login,
  logout,
};
