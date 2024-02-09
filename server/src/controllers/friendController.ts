import { notificationModel, userModel } from '@/models';
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

    if (
      sendingUser.friendRequestsSent.includes(receivingUser._id) ||
      receivingUser.friendRequestsReceived.includes(sendingUser._id)
    ) {
      return next(new AppError('Friend request already sent', 400));
    }

    if (
      receivingUser.friendRequestsSent.includes(sendingUser._id) ||
      sendingUser.friendRequestsReceived.includes(receivingUser._id)
    ) {
      return next(
        new AppError(
          'Unable to send friend request. User already sent you a friend request.',
          400,
        ),
      );
    }

    // add friend request to both users
    sendingUser.friendRequestsSent.push(receivingUser._id);
    receivingUser.friendRequestsReceived.push(sendingUser._id);
    await sendingUser.save();
    await receivingUser.save();

    // create notification
    const notification = await notificationModel.create({
      type: 'incoming_friend_request',
      fromUser: sendingUser._id,
      toUser: receivingUser._id,
    });
    notification.save();

    res.success('Friend request sent', null, 200);
  },
);

const cancelRequest = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const cancellingUserId = req.userId;
    const { userId: friendUserId } = req.params;

    if (!isValidObjectId(friendUserId)) {
      return next(new AppError('Friend user ID is invalid', 400));
    }

    const cancellingUser = await userModel.findById(cancellingUserId);
    if (!cancellingUser) {
      return next(new AppError('Your user information was not found', 400));
    }

    const friendUser = await userModel.findById(friendUserId);
    if (!friendUser) {
      return next(new AppError('User not found', 400));
    }

    if (
      !cancellingUser.friendRequestsSent.includes(friendUser._id) ||
      !friendUser.friendRequestsReceived.includes(cancellingUser._id)
    ) {
      return next(new AppError('Friend request not found', 400));
    }

    // remove friend request from both users
    cancellingUser.friendRequestsSent =
      cancellingUser.friendRequestsSent.filter(
        (friendRequestId: string) =>
          friendRequestId.toString() !== friendUser._id.toString(),
      );
    friendUser.friendRequestsReceived =
      friendUser.friendRequestsReceived.filter(
        (friendRequestId: string) =>
          friendRequestId.toString() !== cancellingUser._id.toString(),
      );
    await cancellingUser.save();
    await friendUser.save();

    // delete old friend request notification
    await notificationModel.deleteOne({
      type: 'incoming_friend_request',
      fromUser: cancellingUser._id,
      toUser: friendUser._id,
    });

    res.success('Friend request cancelled', null, 200);
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

    // delete old friend request notification
    await notificationModel.deleteOne({
      type: 'incoming_friend_request',
      fromUser: sendingUser._id,
      toUser: acceptingUser._id,
    });

    // create notification for sending user that friend request was accepted
    await notificationModel.create({
      type: 'accepted_friend_request',
      fromUser: acceptingUser._id,
      toUser: sendingUser._id,
    });

    res.success('Friend request accepted', null, 200);
  },
);

const rejectRequest = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const rejectingUserId = req.userId;
    const { userId: sendingUserId } = req.params;

    if (!isValidObjectId(sendingUserId)) {
      return next(new AppError('Friend user ID is invalid', 400));
    }

    const rejectingUser = await userModel.findById(rejectingUserId);
    if (!rejectingUser) {
      return next(new AppError('Your user information was not found', 400));
    }

    const sendingUser = await userModel.findById(sendingUserId);
    if (!sendingUser) {
      return next(new AppError('User not found', 400));
    }

    if (
      !rejectingUser.friendRequestsReceived.includes(sendingUser._id) ||
      !sendingUser.friendRequestsSent.includes(rejectingUser._id)
    ) {
      return next(new AppError('Friend request not found', 400));
    }

    // remove friend request from both users
    rejectingUser.friendRequestsReceived =
      rejectingUser.friendRequestsReceived.filter(
        (friendRequestId: string) =>
          friendRequestId.toString() !== sendingUser._id.toString(),
      );
    sendingUser.friendRequestsSent = sendingUser.friendRequestsSent.filter(
      (friendRequestId: string) =>
        friendRequestId.toString() !== rejectingUser._id.toString(),
    );
    await rejectingUser.save();
    await sendingUser.save();

    // delete old friend request notification
    await notificationModel.deleteOne({
      type: 'incoming_friend_request',
      fromUser: sendingUser._id,
      toUser: rejectingUser._id,
    });

    res.success('Friend request rejected', null, 200);
  },
);

const deleteFriend = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletingUserId = req.userId;
    const { userId: friendUserId } = req.params;

    if (!isValidObjectId(friendUserId)) {
      return next(new AppError('Friend user ID is invalid', 400));
    }

    const deletingUser = await userModel.findById(deletingUserId);
    if (!deletingUser) {
      return next(new AppError('Your user information was not found', 400));
    }

    const friendUser = await userModel.findById(friendUserId);
    if (!friendUser) {
      return next(new AppError('User not found', 400));
    }

    if (
      !deletingUser.friends.includes(friendUser._id) ||
      !friendUser.friends.includes(deletingUser._id)
    ) {
      return next(new AppError('Friend not found', 400));
    }

    // remove friend from both users
    deletingUser.friends = deletingUser.friends.filter(
      (friendId: string) => friendId.toString() !== friendUser._id.toString(),
    );
    friendUser.friends = friendUser.friends.filter(
      (friendId: string) => friendId.toString() !== deletingUser._id.toString(),
    );
    await deletingUser.save();
    await friendUser.save();

    // delete notifications all existing notifications between the two users
    await notificationModel.deleteMany({
      $or: [
        {
          fromUser: deletingUser._id,
          toUser: friendUser._id,
        },
        {
          fromUser: friendUser._id,
          toUser: deletingUser._id,
        },
      ],
    });
    console.log('deleting notifications');

    res.success('Friend deleted', null, 200);
  },
);

export default {
  sendRequest,
  cancelRequest,
  acceptRequest,
  rejectRequest,
  deleteFriend,
};
