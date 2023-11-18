import { postModel, userModel } from '@/models';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const getFeed = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req;
    const user = await userModel.findById(userId, { friends: 1 });
    if (!user) {
      return next(new AppError('User not found', 400));
    }
    const posts = await postModel
      .find({
        $or: [{ author: { $in: user.friends } }, { author: user._id }],
      })
      .populate('author', {
        password: 0,
        friendRequestsSent: 0,
        friendRequestsReceived: 0,
      })
      .populate('likes')
      .populate('comments')
      .sort({ createdAt: -1 });

    res.success('Feed retrieved', posts, 200);
  },
);

export default {
  getFeed,
};
