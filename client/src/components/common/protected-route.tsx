import { useAuthContext } from '@/hooks/useAuthContext';
import { FC, useEffect } from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  path?: string;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  path = '/login',
  children,
}) => {
  const { redirectUnauthenticatedUser } = useAuthContext();

  useEffect(() => {
    redirectUnauthenticatedUser(path);
  }, [redirectUnauthenticatedUser, path]);

  return <>{children}</>;
};

export default ProtectedRoute;
