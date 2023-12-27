import { AuthContext, TUser } from '@/components/services/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type ApiResponse = {
  success: boolean;
  data: TNotification[];
  error: string;
};

export type TNotification = {
  type: string;
  fromUser: TUser;
  toUser: string;
  post: string;
  read: boolean;
  _id: string;
};

type NotificationContextProps = {
  status: string;
  error: string;
  notifications: TNotification[];
  getAllNotifications: () => Promise<void>;
  getUnreadNotifications: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
};

export const NotificationContext = createContext<NotificationContextProps>({
  status: STATUS.IDLE,
  error: '',
  notifications: [],
  getAllNotifications: async () => {},
  getUnreadNotifications: async () => {},
  deleteNotification: async () => {},
  markNotificationAsRead: async () => {},
});

type TNotificationProviderPros = {
  children: React.ReactNode;
};

const NotificationProvider: FC<TNotificationProviderPros> = ({ children }) => {
  const { user } = useContext(AuthContext);
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
        await api.get<ApiResponse>('/notifications');
      if (!success) {
        console.log(error);
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }
      setNotifications(data);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  }, []);

  const getUnreadNotifications = useCallback(async () => {
    setStatus(STATUS.LOADING);
    setError('');

    try {
      const { success, data, error } = await api.get<ApiResponse>(
        '/notifications/unread',
      );
      if (!success) {
        console.log(error);
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }
      setNotifications(data);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  }, []);

  const markNotificationAsRead = useCallback(
    async (notificationId: string) => {
      setStatus(STATUS.LOADING);
      setError('');

      try {
        const { success, error } = await api.put<ApiResponse>(
          `/notifications/${notificationId}/read`,
          {},
        );
        if (!success) {
          console.log(error);
          setStatus(STATUS.ERROR);
          setError(error);
          return;
        }
        await getUnreadNotifications();
        setStatus(STATUS.SUCCESS);
      } catch (error) {
        setStatus(STATUS.ERROR);
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
        const { success, error } = await api.del<ApiResponse>(
          `/notifications/${notificationId}`,
        );
        if (!success) {
          console.log(error);
          setStatus(STATUS.ERROR);
          setError(error);
          return;
        }
        await getUnreadNotifications();
        setStatus(STATUS.SUCCESS);
      } catch (error) {
        setStatus(STATUS.ERROR);
        console.log(error);
      }
    },
    [getUnreadNotifications],
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        getAllNotifications,
        getUnreadNotifications,
        deleteNotification,
        markNotificationAsRead,
        status,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
