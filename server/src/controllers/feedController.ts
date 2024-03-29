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
      .populate({
        path: 'author',
        select: '_id username email photo',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'likes',
          populate: {
            path: 'user',
            select: '_id username email photo',
          },
        },
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: '_id username email photo',
        },
      })
      .populate({
        path: 'likes',
        populate: {
          path: 'user',
          select: '_id username email photo',
        },
      })
      .sort({ createdAt: -1 });

    res.success('Feed retrieved', posts, 201);
  },
);

export default {
  getFeed,
};
