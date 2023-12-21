import { notificationController } from '@/controllers';
import { ensureAuthenticated } from '@/middleware';
import { Router } from 'express';

const notificationRouter = Router();

notificationRouter.get(
  '/',
  ensureAuthenticated,
  notificationController.getNotifications,
);

notificationRouter.get(
  '/unread',
  ensureAuthenticated,
  notificationController.getUnreadNotifications,
);

notificationRouter.put(
  '/:notificationId/read',
  ensureAuthenticated,
  notificationController.markNotificationAsRead,
);

notificationRouter.put(
  '/read-all',
  ensureAuthenticated,
  notificationController.markAllNotificationsAsRead,
);

notificationRouter.delete(
  '/:notificationId',
  ensureAuthenticated,
  notificationController.deleteNotification,
);

export default notificationRouter;
