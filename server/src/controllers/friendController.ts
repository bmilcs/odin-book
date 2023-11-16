import { userModel } from '@/models';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

const sendRequest = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId: friendUserId } = req.params;
    const sendingUserId = req.userId;
    if (!isValidObjectId(friendUserId)) {
      return next(new AppError('Friend user ID is invalid', 400));
    }
    if (friendUserId === sendingUserId) {
      return next(new AppError('Cannot send friend request to yourself', 400));
    }
    const sendingUser = await userModel.findById(sendingUserId);
    if (!sendingUser) {
      return next(new AppError('Your user information was not found', 400));
    }
    const receivingUser = await userModel.findById(friendUserId);
    if (!receivingUser) {
      return next(new AppError('User not found', 400));
    }
    if (sendingUser.friends.includes(receivingUser._id)) {
      return next(new AppError('Already friends', 400));
    }
    sendingUser.friendRequestsSent.push(receivingUser._id);
    receivingUser.friendRequestsReceived.push(sendingUser._id);
    await sendingUser.save();
    await receivingUser.save();
    res.success('Friend request sent', null, 200);
  },
);

const acceptRequest = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const acceptingUserId = req.userId;
    const { userId: sendingUserId } = req.params;
    if (!isValidObjectId(sendingUserId)) {
      return next(new AppError('Friend user ID is invalid', 400));
    }
    const acceptingUser = await userModel.findById(acceptingUserId);
    if (!acceptingUser) {
      return next(new AppError('Your user information was not found', 400));
    }
    const sendingUser = await userModel.findById(sendingUserId);
    if (!sendingUser) {
      return next(new AppError('User not found', 400));
    }
    if (
      !acceptingUser.friendRequestsReceived.includes(sendingUser._id) ||
      !sendingUser.friendRequestsSent.includes(acceptingUser._id)
    ) {
      return next(new AppError('Friend request not found', 400));
    }
    // add friend to both users
    acceptingUser.friends.push(sendingUser._id);
    sendingUser.friends.push(acceptingUser._id);
    // remove friend request from both users
    acceptingUser.friendRequestsReceived =
      acceptingUser.friendRequestsReceived.filter(
        (friendRequestId: string) =>
          friendRequestId.toString() !== sendingUser._id.toString(),
      );
    sendingUser.friendRequestsSent = sendingUser.friendRequestsSent.filter(
      (friendRequestId: string) =>
        friendRequestId.toString() !== acceptingUser._id.toString(),
    );
    await acceptingUser.save();
    await sendingUser.save();
    res.success('Friend request accepted', null, 200);
  },
);

const rejectRequest = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('reject friend request', null, 200);
  },
);

const deleteFriend = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('delete friend', null, 200);
  },
);

export default {
  sendRequest,
  acceptRequest,
  rejectRequest,
  deleteFriend,
};
