import { userModel } from '@/models';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const status = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    // jwtCookieHandler middleware attaches userId to req object if authenticated
    const isAuthenticated = req.userId;
    if (isAuthenticated) {
      const user = await userModel
        .findById(req.userId, {
          password: 0,
        })
        .populate('friends', 'username email')
        .populate('friendRequestsSent', 'username email')
        .populate('friendRequestsReceived', 'username email')
        .populate('notifications')
        .populate({
          path: 'notifications',
          match: { read: false },
          populate: {
            path: 'fromUser',
            select:
              '-password -friends -friendRequestsReceived -friendRequestsSent',
          },
        });
      return res.success('Authenticated', user, 201);
    }
    res.success('Not authenticated', null, 200);
  },
);

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
      return next(
        new AppError('Unable to create a user at this time', 500, 'AppError'),
      );
    }
    const data = {
      username: user.username,
      email: user.email,
      _id: user.id,
      friends: user.friends,
      friendRequestsSent: user.friendRequestsSent,
      friendRequestsReceived: user.friendRequestsReceived,
      notifications: user.notifications,
    };
    res.addJwtCookies(user.id);
    res.success('User created successfully', data, 201);
  },
);

const login = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await userModel
      .findOne({ email })
      .populate('friends', 'username email')
      .populate('friendRequestsSent', 'username email')
      .populate('friendRequestsReceived', 'username email')
      .populate('notifications')
      .populate({
        path: 'notifications',
        match: { read: false },
        populate: {
          path: 'fromUser',
          select:
            '-password -friends -friendRequestsReceived -friendRequestsSent',
        },
      });
    if (!user) {
      return next(new AppError('Invalid email or password', 401, 'LoginError'));
    }
    await user.comparePassword(
      password,
      async (err: Error, isValid: boolean) => {
        if (err) {
          next(new AppError('Unable to login at this time', 500, 'AppError'));
        }
        if (!isValid) {
          next(new AppError('Invalid email or password', 401, 'LoginError'));
        }
        const data = {
          username: user.username,
          email: user.email,
          _id: user.id,
          friends: user.friends,
          friendRequestsSent: user.friendRequestsSent,
          friendRequestsReceived: user.friendRequestsReceived,
          notifications: user.notifications,
        };
        res.addJwtCookies(user.id);
        res.success('LoginSuccess', data, 201);
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
  status,
  signup,
  login,
  logout,
};
