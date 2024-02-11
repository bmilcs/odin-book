import Feed from '@/components/common/feed';
import PostNewForm from '@/components/common/post-new-form';
import UserSummary from '@/components/common/user-summary';
import CenterColumnContainer from '@/components/layout/center-column-container';

const FeedPage = () => {
  return (
    <CenterColumnContainer className="">
      <div className="grid gap-4 lg:grid-cols-[350px_1fr]">
        <PostNewForm className="order-0 h-min lg:order-none lg:col-span-2" />
        <UserSummary className="h-min" />
        <Feed className="grid gap-4" />
      </div>
    </CenterColumnContainer>
  );
};

export default FeedPage;
