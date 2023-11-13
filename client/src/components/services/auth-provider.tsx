import LoadingPage from '@/components/pages/loading';
import api from '@/utils/api';
import { FC, ReactNode, createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ApiResponse {
  data: User;
  success: boolean;
  message: string;
  error: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: () => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  logout: () => {},
  isAuthenticated: () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const navigate = useNavigate();

  function isAuthenticated() {
    if (isLoading) return false;
    return !!user;
  }

  async function logout() {
    try {
      const result: ApiResponse = await api.post('/auth/logout', {});
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
        const result: ApiResponse = await api.get('/auth/status');
        if (result.success && result.data) {
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
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoading]);

  if (showSpinner) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
