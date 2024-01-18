import LoadingPage from '@/components/pages/loading-page';
import { TNotification } from '@/components/services/notification-provider';
import api from '@/utils/api';
import { getErrorMsg } from '@/utils/errors';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

type TApiResponse = {
  data: TUser;
  success: boolean;
  message: string;
  error: string;
};

export type TFriend = {
  _id: string;
  username: string;
};

export type TFriendRequest = {
  _id: string;
  username: TFriend;
  email: TFriend;
};

export type TUser = {
  _id: string;
  username: string;
  email: string;
  profile: {
    bio: string;
    location: string;
  };
  friends: TFriend[];
  friendRequestsReceived: TFriendRequest[];
  friendRequestsSent: TFriendRequest[];
  notifications: TNotification[];
  createdAt: string;
  updatedAt: string;
};

type AuthContextProps = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isAuthenticated: () => boolean;
  logout: () => void;
  redirectUnauthenticatedUser: (path: string) => void;
  redirectAuthenticatedUser: (path: string) => void;
  updateUserData: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  logout: () => {},
  isAuthenticated: () => false,
  redirectUnauthenticatedUser: () => {},
  redirectAuthenticatedUser: () => {},
  updateUserData: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = useCallback(() => {
    if (isLoading) return false;
    return !!user;
  }, [isLoading, user]);

  const redirectUnauthenticatedUser = useCallback(
    (path: string) => {
      if (isLoading) return;
      if (!isAuthenticated()) {
        navigate(path);
      }
    },
    [isLoading, isAuthenticated, navigate],
  );

  const redirectAuthenticatedUser = useCallback(
    (path: string) => {
      if (isLoading) return;
      if (isAuthenticated()) {
        navigate(path);
      }
    },
    [isLoading, isAuthenticated, navigate],
  );

  const logout = async () => {
    try {
      const { success } = await api.post<TApiResponse>('/auth/logout', {});
      if (success) {
        setUser(null);
        navigate('/login');
        return;
      }
      console.log('Unable to logout at this time');
    } catch (error) {
      const errorMsg = getErrorMsg(error);
      console.log(errorMsg);
    }
  };

  const updateUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { success, data } = await api.get<TApiResponse>('/auth/status');
      if (success) {
        setUser(data);
        return;
      }
      setUser(null);
      console.log('Unable to update user data at this time');
    } catch (error) {
      const errorMsg = getErrorMsg(error);
      console.log(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  // Show spinner while waiting for user data to load for at least 250ms
  // This prevents the spinner from flashing on the screen for a split second
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 250);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoading]);

  if (showSpinner) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        logout,
        redirectUnauthenticatedUser,
        redirectAuthenticatedUser,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
