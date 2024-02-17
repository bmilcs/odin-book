import LoadingPage from '@/pages/loading-page';
import api from '@/utils/api';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TUser } from '@/utils/types';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

type FetchUserDataApiResponse = TApiResponse & {
  data: TUser;
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

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<TUser | null>(null);
  const [showSpinner, setShowSpinner] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    if (isLoading) return false;
    return !!user;
  }, [isLoading, user]);

  // Redirect user if they are not authenticated
  const redirectUnauthenticatedUser = useCallback(
    (path: string) => {
      if (isLoading) return;
      if (!isAuthenticated()) {
        navigate(path);
      }
    },
    [isLoading, isAuthenticated, navigate],
  );

  // Redirect user if they are authenticated
  const redirectAuthenticatedUser = useCallback(
    (path: string) => {
      if (isLoading) return;
      if (isAuthenticated()) {
        navigate(path);
      }
    },
    [isLoading, isAuthenticated, navigate],
  );

  // Fetch user data using httpOnly cookies
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { success, data } =
        await api.get<FetchUserDataApiResponse>('/auth/status');
      if (success) {
        setUser(data);
        return;
      }
      setUser(null);
    } catch (error) {
      setUser(null);
      const errorMsg = getErrorMsg(error);
      console.log(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  // Fetch user data on initial load
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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

  // Show spinner while waiting for user data to load
  if (showSpinner) {
    return <LoadingPage />;
  }

  // Provide user data to the app
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
