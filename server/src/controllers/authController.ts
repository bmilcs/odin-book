import { userModel } from '@/models';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const signup = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    // validation & duplicate checks occur in previous middleware
    const { email, password, username } = req.body;
    const user = await userModel.create({
      email,
      password,
      username,
    });
    if (!user) {
      throw new AppError('Unable to create a user at this time', 500);
    }
    const data = { userId: user.id };
    res.addJwtCookies(user.id);
    res.success('User created successfully', data, 200);
  },
);

const login = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json('login');
  },
);

const logout = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json('logout');
  },
);

export default {
  signup,
  login,
  logout,
};
