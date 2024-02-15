import { TNotification } from '@/context/notification-provider';
import useUpdateUserData from '@/hooks/useUpdateUserData';
import LoadingPage from '@/pages/loading-page';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

export type TFriend = {
  _id: string;
  username: string;
};

export type TFriendRequest = {
  _id: string;
  username: string;
  email: string;
};

export type TUser = {
  _id: string;
  username: string;
  email: string;
  photo: string;
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
  redirectUnauthenticatedUser: (path: string) => void;
  redirectAuthenticatedUser: (path: string) => void;
};

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  isAuthenticated: () => false,
  redirectUnauthenticatedUser: () => {},
  redirectAuthenticatedUser: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { updateUserData, isLoading } = useUpdateUserData();

  const [user, setUser] = useState<TUser | null>(null);
  const [showSpinner, setShowSpinner] = useState(true);

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

  // Update user data on initial page load
  useEffect(() => {
    updateUserData();
  }, [updateUserData]);

  // Show spinner while waiting for user data to load for at least 250ms
  // This prevents the spinner from flashing on the screen for a split second
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 250);

    return () => {
      clearTimeout(timer);
    };
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
        redirectUnauthenticatedUser,
        redirectAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
