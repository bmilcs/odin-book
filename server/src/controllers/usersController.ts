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
    const { userId } = req;
    const { username } = req.params;
    // get info for requesting user
    const requestingUser = await userModel.findById(userId, {
      password: 0,
    });
    if (!requestingUser) {
      return next(new AppError('Your user information was not found', 400));
    }
    // make sure requesting user is the profile owner
    if (requestingUser.username !== username) {
      return next(new AppError('You are not the profile owner', 403));
    }
    // make sure new username is not taken
    const { username: newUsername } = req.body;
    if (newUsername !== username) {
      const isDuplicate = await userModel.exists({ username: newUsername });
      if (isDuplicate) {
        return next(new AppError('Username already in use', 409));
      }
    }
    // make sure new email is not taken
    const { email: newEmail } = req.body;
    if (newEmail !== requestingUser.email) {
      const isDuplicate = await userModel.exists({ email: newEmail });
      if (isDuplicate) {
        return next(new AppError('Email already in use', 409));
      }
    }
    // update user profile
    const { bio, location } = req.body;
    requestingUser.profile.bio = bio;
    requestingUser.profile.location = location;
    requestingUser.email = newEmail;
    requestingUser.username = newUsername;
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
