import LoadingPage from '@/components/pages/loading-page';
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
  friends: TFriend[];
  friendRequestsReceived: TFriendRequest[];
  friendRequestsSent: TFriendRequest[];
};

type AuthContextProps = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isAuthenticated: () => boolean;
  logout: () => void;
  redirectUnauthenticatedUser: (path: string) => void;
  redirectAuthenticatedUser: (path: string) => void;
};

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  logout: () => {},
  isAuthenticated: () => false,
  redirectUnauthenticatedUser: () => {},
  redirectAuthenticatedUser: () => {},
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

  useEffect(() => {
    getUserDataOnInitialLoad();

    async function getUserDataOnInitialLoad() {
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
  }, []);

  // Ensure spinner shows for at least 1 second
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
