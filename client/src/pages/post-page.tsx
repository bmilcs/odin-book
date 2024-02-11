import Post from '@/components/common/post';
import CenterColumnContainer from '@/components/layout/center-column-container';
import usePost from '@/hooks/usePost';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostPage = () => {
  const { postId } = useParams();
  const { getPost, postData, status, error } = usePost();

  useEffect(() => {
    if (!postId) return;
    getPost({ postId });
  }, [postId, getPost]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>{error}</div>;
  }

  if (postData) {
    return (
      <CenterColumnContainer>
        <Post data={postData} />
      </CenterColumnContainer>
    );
  }
};

export default PostPage;
