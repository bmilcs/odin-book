import { AuthContext } from '@/components/services/auth-provider';
import { useContext, useEffect } from 'react';

const HomePage = () => {
  const { redirectAuthenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    redirectAuthenticatedUser('/feed');
  }, [redirectAuthenticatedUser]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-black">FriendLink</h1>
      <p className="text-lg font-normal">A social media platform for friends</p>
    </div>
  );
};

export default HomePage;
