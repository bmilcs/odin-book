import { notificationModel, userModel } from '@/models';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

const getNotifications = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req;

    const notifications = await notificationModel
      .find({
        toUser: userId,
      })
      .populate('fromUser', 'username email _id photo');

    if (!notifications) {
      return next(new AppError('Notifications not found', 400));
    }

    res.success('Notifications fetched successfully', notifications, 201);
  },
);

const getUnreadNotifications = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req;

    const notifications = await notificationModel
      .find({
        toUser: userId,
        read: false,
      })
      .populate('fromUser', 'username email _id photo');

    if (!notifications) {
      return next(new AppError('Notifications not found', 400));
    }

    res.success(
      'Unread notifications fetched successfully',
      notifications,
      201,
    );
  },
);

const markNotificationAsRead = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { notificationId } = req.params;
    const { userId } = req;

    if (!isValidObjectId(notificationId)) {
      return next(new AppError('Notification ID is invalid', 400));
    }

    const notification = await notificationModel.findById(notificationId);
    if (!notification) {
      return next(new AppError('Notification not found', 400));
    }

    if (notification.toUser.toString() !== userId) {
      return next(new AppError('Notification not found', 400));
    }

    notification.read = true;
    await notification.save();

    res.success('Marked notification as read successfully', null, 200);
  },
);

const markAllNotificationsAsRead = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req;

    const notifications = await notificationModel.find({
      toUser: userId,
    });

    if (!notifications) {
      return next(new AppError('Notifications not found', 400));
    }

    await Promise.all(
      notifications.map(async (notification) => {
        notification.read = true;
        await notification.save();
      }),
    );

    res.success('Marked all notifications as read successfully', null, 200);
  },
);

const deleteNotification = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { notificationId } = req.params;
    const { userId } = req;

    if (!isValidObjectId(notificationId)) {
      return next(new AppError('Notification ID is invalid', 400));
    }

    const notification = await notificationModel.findById(notificationId);
    if (!notification) {
      return next(new AppError('Notification not found', 400));
    }

    if (notification.toUser.toString() !== userId) {
      return next(new AppError('Notification not found', 400));
    }

    await notification.deleteOne();

    res.success('Deleted notification successfully', null, 200);
  },
);

const deleteAllNotifications = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req;
    await notificationModel.deleteMany({ toUser: userId });
    await userModel.updateOne({ _id: userId }, { $set: { notifications: [] } });
    res.success('Deleted all notifications successfully', null, 200);
  },
);

export default {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
};
