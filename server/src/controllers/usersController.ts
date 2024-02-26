import { postModel, userModel } from '@/models';
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
        .populate('friends', { username: 1, photo: 1, _id: 1 });

      if (!user) {
        return next(new AppError('User not found', 400));
      }

      const recentPosts = await postModel
        .find({ author: user?._id })
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
        .sort({ createdAt: -1 })
        .limit(5);

      const responseData = {
        ...user.toObject(),
        recentPosts: recentPosts,
      };

      res.success('Full user profile fetched successfully', responseData, 201);
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
    const data = {
      username: requestingUser.username,
      email: requestingUser.email,
      profile: {
        location: requestingUser.profile.location,
        bio: requestingUser.profile.bio,
      },
    };
    res.success('User profile updated successfully', data, 201);
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
      { _id: 1, username: 1, photo: 1 },
    );
    const usersFound = users.length > 0;
    res.success('Search complete', users, usersFound ? 201 : 200);
  },
);

const uploadProfileImage = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, file } = req;

    if (!file) {
      return next(new AppError('Please provide an image', 400));
    }

    // save image url to user profile
    const user = await userModel.findById(userId);
    if (!user) {
      return next(new AppError('Your user information was not found', 400));
    }

    user.photo = `/uploads/profile-images/${file.filename}`;
    await user.save();

    res.success('Profile image uploaded successfully', user.photo, 201);
  },
);

const getAllUsers = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userModel.find({}, { _id: 1, username: 1, photo: 1 });
    res.success('All users fetched successfully', users, 201);
  },
);

export default {
  getProfile,
  getAllUsers,
  updateProfile,
  uploadProfileImage,
  search,
};
