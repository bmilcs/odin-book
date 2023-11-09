import api from '@/utils/api';
import { FC, ReactNode, createContext, useEffect, useState } from 'react';

interface ApiResponse {
  data: User;
  success: boolean;
  message: string;
  error: string;
}

interface User {
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

  function isAuthenticated() {
    if (isLoading) return false;
    return !!user;
  }

  async function logout() {
    try {
      const result: ApiResponse = await api.post('/auth/logout', {});
      if (result.success) {
        setUser(null);
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

  // if (isLoading) {
  //   return (
  //     <main>
  //       <h1>Loading...</h1>
  //     </main>
  //   );
  // }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
