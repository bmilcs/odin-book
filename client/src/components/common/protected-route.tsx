import { AuthContext } from '@/components/services/auth-provider';
import { FC, useContext, useEffect } from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  path?: string;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  path = '/login',
  children,
}) => {
  const { redirectUnauthenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    redirectUnauthenticatedUser(path);
  }, [redirectUnauthenticatedUser, path]);

  return <>{children}</>;
};

export default ProtectedRoute;
