import { userModel } from '@/models';
import { IUser } from '@/models/userModel';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const getProfile = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req;
    const { username } = req.params;

    // get info for requesting user
    const requestingUser = await userModel.findById(userId).populate('friends');
    if (!requestingUser) {
      return next(new AppError('Your user information was not found', 400));
    }

    const isProfileOwner = requestingUser.username === username;
    const isAFriend = requestingUser.friends.some((friend: IUser) => {
      return friend.username === username;
    });

    if (isProfileOwner || isAFriend) {
      // get full user profile
      const user = await userModel
        .findOne(
          { username },
          {
            password: 0,
            notifications: 0,
            friendRequestsSent: 0,
            friendRequestsReceived: 0,
          },
        )
        .populate('friends');
      if (!user) {
        return next(new AppError('User not found', 400));
      }
      res.success('Full user profile fetched successfully', user, 201);
    } else {
      // get partial user profile
      const user = await userModel
        .findOne({ username }, { _id: 1, username: 1, friends: 1 })
        .populate('friends');
      if (!user) {
        return next(new AppError('User not found', 400));
      }
      return res.success('Partial user info fetched successfully', user, 201);
    }
  },
);

const updateProfile = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    // username & email duplicate checks are handled by the validation middleware
    // so we don't need to check for duplicates here
    const { userId } = req;
    // get info for requesting user
    const requestingUser = await userModel.findById(userId, {
      password: 0,
    });
    if (!requestingUser) {
      return next(new AppError('Your user information was not found', 400));
    }
    // update user profile
    const { bio, location, username: newUserName, email: newEmail } = req.body;
    requestingUser.profile.bio = bio;
    requestingUser.profile.location = location;
    requestingUser.email = newEmail;
    requestingUser.username = newUserName;
    // requestingUser.username = username;
    requestingUser.markModified('profile');
    await requestingUser.save();
    res.success('User profile updated successfully', requestingUser, 201);
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
