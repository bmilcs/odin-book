import SignupForm from '@/components/common/signup-form';
import { AuthContext } from '@/components/services/auth-provider';
import { useContext, useEffect } from 'react';

const SignupPage = () => {
  const { redirectAuthenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    redirectAuthenticatedUser('/feed');
  }, [redirectAuthenticatedUser]);

  return (
    <div className="grid h-full place-items-center">
      <SignupForm className="m-auto min-w-[min(400px,80vw)] max-w-3xl" />;
    </div>
  );
};

export default SignupPage;
