import { userModel } from '@/models';
import { IUser } from '@/models/userModel';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const getProfile = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req;
    const { username } = req.params;

    const activeUser = await userModel.findById(userId).populate('friends');
    if (!activeUser) {
      return next(new AppError('Your user information was not found', 400));
    }

    const isProfileOwner = activeUser.username === username;
    const isAFriend = activeUser.friends.some((friend: IUser) => {
      return friend.username === username;
    });
    if (!isProfileOwner && !isAFriend) {
      return next(new AppError('You are not friends with this user', 400));
    }

    // get user profile
    const user = await userModel.findOne({ username }, { password: 0 });
    if (!user) {
      return next(new AppError('User not found', 400));
    }

    res.success('User profile fetched successfully', user, 201);
  },
);

const updateProfile = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('User profile updated successfully', null, 201);
  },
);

const search = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { searchTerm } = req.params;
    if (!searchTerm) {
      return next(new AppError('Please provide a search term', 400));
    }
    const user = await userModel.findById(req.userId);
    if (!user) {
      return next(new AppError('Your user information was not found', 400));
    }
    // find users with username or email that match the search term
    const users = await userModel.find(
      {
        $or: [
          { username: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
        ],
      },
      { _id: 1, username: 1 },
    );
    const usersFound = users.length > 0;
    res.success('Search complete', users, usersFound ? 201 : 200);
  },
);

export default {
  getProfile,
  updateProfile,
  search,
};
