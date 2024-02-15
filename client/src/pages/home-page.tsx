import CenterScreenContainer from '@/components/layout/center-screen-container';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useEffect } from 'react';

const HomePage = () => {
  const { redirectAuthenticatedUser } = useAuthContext();

  useEffect(() => {
    redirectAuthenticatedUser('/feed');
  }, [redirectAuthenticatedUser]);

  return (
    <CenterScreenContainer>
      <div className="text-center">
        <h1 className="text-4xl font-black">FriendLink</h1>
        <p className="text-lg font-normal">
          A social media platform for friends
        </p>
      </div>
    </CenterScreenContainer>
  );
};

export default HomePage;
