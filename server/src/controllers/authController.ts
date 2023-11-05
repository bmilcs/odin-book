import { userModel } from '@/models';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const signup = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username } = req.body;
    const user = await userModel.create({
      email,
      password,
      username,
    });
    if (!user) {
      // this should never occur. validation & duplicate checks are performed
      // in previous middleware
      throw new AppError(
        'Unable to create a user at this time',
        500,
        'AppError',
      );
    }
    const data = { username: user.username };
    res.addJwtCookies(user.id);
    res.success('User created successfully', data, 200);
  },
);

const login = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'LoginError');
    }
    await user.comparePassword(
      password,
      async (err: Error, isValid: boolean) => {
        if (err) {
          throw new AppError('Unable to login at this time', 500, 'AppError');
        }
        if (!isValid) {
          next(new AppError('Invalid email or password', 401, 'LoginError'));
        }
        const data = { username: user.username };
        res.addJwtCookies(user.id);
        res.success('LoginSuccess', data, 200);
      },
    );
  },
);

const logout = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    res.success('LogoutSuccess', null, 200);
  },
);

export default {
  signup,
  login,
  logout,
};
