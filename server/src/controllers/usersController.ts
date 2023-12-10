import { userModel } from '@/models';
import { AppError, tryCatch } from '@/utils';
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

const search = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const user = await userModel.findById(req.userId);
    if (!user) {
      return next(new AppError('Your user information was not found', 400));
    }
    const friends = await userModel.find(
      {
        username: { $regex: username, $options: 'i' },
        _id: { $in: user.friends },
      },
      { _id: 1, username: 1 },
    );
    res.success('Friends found', friends, 200);
  },
);

export default {
  getProfile,
  updateProfile,
  search,
};
