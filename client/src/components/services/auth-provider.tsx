import LoadingPage from '@/components/pages/loading-page';
import { TNotification } from '@/components/services/notification-provider';
import api from '@/utils/api';
import { FC, ReactNode, createContext, useEffect, useState } from 'react';
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

  function redirectUnauthenticatedUser(path: string) {
    if (isLoading) return;
    if (!isAuthenticated()) {
      navigate(path);
    }
  }

  function redirectAuthenticatedUser(path: string) {
    if (isLoading) return;
    if (isAuthenticated()) {
      navigate(path);
    }
  }

  function isAuthenticated() {
    if (isLoading) return false;
    return !!user;
  }

  async function logout() {
    try {
      const result: TApiResponse = await api.post('/auth/logout', {});
      if (result.success) {
        setUser(null);
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUserData() {
    try {
      const result: TApiResponse = await api.get('/auth/status');
      if (result.success && result.data) {
        console.log(result.data);
        setUser(result.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    updateUserData();
  }, []);

  // Ensure spinner shows for at least .25 seconds
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
