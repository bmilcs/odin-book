import Post from '@/components/common/post';
import { AuthContext } from '@/components/services/auth-provider';
import usePost from '@/hooks/usePost';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostPage = () => {
  const { postId } = useParams();
  const { redirectUnauthenticatedUser } = useContext(AuthContext);
  const { getPost, postData, status, error } = usePost();

  useEffect(() => {
    redirectUnauthenticatedUser('/login');
  }, [redirectUnauthenticatedUser]);

  useEffect(() => {
    if (!postId) return;
    getPost({ postId });
  }, [postId, getPost]);

  const handleSuccessfulEditPost = () => {
    if (!postId) return;
    getPost({ postId });
  };

  const handleSuccessfulDeletePost = () => {
    if (!postId) return;
    getPost({ postId });
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>{error}</div>;
  }

  if (postData) {
    return (
      <>
        <Post
          data={postData}
          onSuccessfulEditPost={handleSuccessfulEditPost}
          onSuccessfulDeletePost={handleSuccessfulDeletePost}
          className="my-8"
        />
      </>
    );
  }
};

export default PostPage;
