import Feed from '@/components/common/feed';
import PostNewForm from '@/components/common/post-new-form';
import CenterColumnContainer from '@/components/layout/center-column-container';

const FeedPage = () => {
  return (
    <CenterColumnContainer>
      <PostNewForm />
      <Feed />
    </CenterColumnContainer>
  );
};

export default FeedPage;
