import Post from '@/components/common/post';
import CenterColumnContainer from '@/components/layout/center-column-container';
import useFetchPost from '@/hooks/useFetchPost';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostPage = () => {
  const { postId } = useParams();
  const { fetchPost, postData, status, error } = useFetchPost();

  useEffect(() => {
    if (!postId) return;
    fetchPost({ postId });
  }, [postId, fetchPost]);

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
