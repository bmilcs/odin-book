import { useAuthContext } from '@/hooks/useAuthContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TNotification } from '@/utils/types';
import { FC, createContext, useCallback, useEffect, useState } from 'react';

type NotificationApiResponses = TApiResponse & {
  data: TNotification[];
};

type NotificationContextProps = {
  status: string;
  error: string;
  notifications: TNotification[];
  getAllNotifications: () => Promise<void>;
  getUnreadNotifications: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
};

export const NotificationContext = createContext<NotificationContextProps>({
  status: STATUS.IDLE,
  error: '',
  notifications: [],
  getAllNotifications: async () => {},
  getUnreadNotifications: async () => {},
  deleteNotification: async () => {},
  deleteAllNotifications: async () => {},
  markNotificationAsRead: async () => {},
  markAllNotificationsAsRead: async () => {},
});

type TNotificationProviderPros = {
  children: React.ReactNode;
};

const NotificationProvider: FC<TNotificationProviderPros> = ({ children }) => {
  const { user } = useAuthContext();

  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');

  useEffect(
    function updateNotificationsOnUserChange() {
      if (user) {
        setNotifications(user.notifications);
      }
    },
    [user],
  );

  const getAllNotifications = useCallback(async () => {
    setStatus(STATUS.LOADING);
    setError('');

    try {
      const { success, data, error } =
        await api.get<NotificationApiResponses>('/notifications');
      if (success) {
        setStatus(STATUS.SUCCESS);
        setNotifications(data);
        return;
      }
      setStatus(STATUS.ERROR);
      setError(error);
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(error);
    }
  }, []);

  const getUnreadNotifications = useCallback(async () => {
    setStatus(STATUS.LOADING);
    setError('');

    try {
      const { success, data, error } = await api.get<NotificationApiResponses>(
        '/notifications/unread',
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        setNotifications(data);
        return;
      }
      setStatus(STATUS.ERROR);
      setError(error);
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(error);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    setStatus(STATUS.LOADING);
    setError('');

    try {
      const { success, error } = await api.put<NotificationApiResponses>(
        '/notifications/read-all',
        {},
      );
      console.log({ success, error });
      if (success) {
        setStatus(STATUS.SUCCESS);
        await getUnreadNotifications();
        return;
      }
      setStatus(STATUS.ERROR);
      setError(error);
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(error);
    }
  }, [getUnreadNotifications]);

  const markNotificationAsRead = useCallback(
    async (notificationId: string) => {
      setStatus(STATUS.LOADING);
      setError('');

      try {
        const { success, error } = await api.put<NotificationApiResponses>(
          `/notifications/${notificationId}/read`,
          {},
        );
        if (success) {
          setStatus(STATUS.SUCCESS);
          await getUnreadNotifications();
          return;
        }
        setStatus(STATUS.ERROR);
        setError(error);
      } catch (error) {
        setStatus(STATUS.ERROR);
        const errorMsg = getErrorMsg(error);
        setError(errorMsg);
        console.log(error);
      }
    },
    [getUnreadNotifications],
  );

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      setStatus(STATUS.LOADING);
      setError('');

      try {
        const { success, error } = await api.del<NotificationApiResponses>(
          `/notifications/${notificationId}`,
        );
        if (success) {
          setStatus(STATUS.SUCCESS);
          await getUnreadNotifications();
          return;
        }
        setStatus(STATUS.ERROR);
        setError(error);
      } catch (error) {
        setStatus(STATUS.ERROR);
        const errorMsg = getErrorMsg(error);
        setError(errorMsg);
        console.log(error);
      }
    },
    [getUnreadNotifications],
  );

  const deleteAllNotifications = useCallback(async () => {
    setStatus(STATUS.LOADING);
    setError('');

    try {
      const { success, error } =
        await api.del<NotificationApiResponses>('/notifications');
      console.log(success, error);
      if (success) {
        setStatus(STATUS.SUCCESS);
        await getAllNotifications();
        return;
      }
      setStatus(STATUS.ERROR);
      setError(error);
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(error);
    }
  }, [getAllNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        getAllNotifications,
        getUnreadNotifications,
        deleteNotification,
        deleteAllNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        status,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
