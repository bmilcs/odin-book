import Feed from '@/components/common/feed';
import PostNewForm from '@/components/common/post-new-form';
import { AuthContext } from '@/components/services/auth-provider';
import { useContext, useEffect } from 'react';

const FeedPage = () => {
  const { redirectUnauthenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    redirectUnauthenticatedUser('/login');
  }, [redirectUnauthenticatedUser]);

  return (
    <>
      <PostNewForm />
      <Feed />
    </>
  );
};

export default FeedPage;
