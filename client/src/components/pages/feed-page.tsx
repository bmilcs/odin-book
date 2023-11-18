import Feed from '@/components/common/feed';
import PostForm from '@/components/common/post-form';
import { AuthContext } from '@/components/services/auth-provider';
import { useContext, useEffect } from 'react';

const FeedPage = () => {
  const { redirectUnauthenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    redirectUnauthenticatedUser('/login');
  }, [redirectUnauthenticatedUser]);

  return (
    <>
      <PostForm />
      <Feed />
    </>
  );
};

export default FeedPage;
