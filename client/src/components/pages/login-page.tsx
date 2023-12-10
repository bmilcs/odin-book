import LoginForm from '@/components/common/login-form';
import { AuthContext } from '@/components/services/auth-provider';
import { useContext, useEffect } from 'react';

const LoginPage = () => {
  const { redirectAuthenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    redirectAuthenticatedUser('/feed');
  }, [redirectAuthenticatedUser]);

  return (
    <div className="grid h-full place-items-center">
      <LoginForm className="m-auto min-w-[min(400px,80vw)] max-w-3xl" />
    </div>
  );
};

export default LoginPage;
