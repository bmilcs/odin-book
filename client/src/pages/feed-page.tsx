import Feed from '@/components/common/feed';
import FeedUserSummary from '@/components/common/feed-user-summary';
import FriendsList from '@/components/common/friends-list';
import PostNewForm from '@/components/common/post-new-form';
import { useAuthContext } from '@/hooks/useAuthContext';

const FeedPage = () => {
  const { friends } = useAuthContext();

  return (
    <>
      <h1 className="sr-only">Your Feed</h1>

      <div className="grid gap-4 lg:grid-cols-[350px_1fr]">
        {/* left column */}
        <div className="space-y-4">
          <FeedUserSummary className="h-min" />

          <div className="hidden pl-4 lg:block">
            <h2 className="mb-2 text-xl font-bold">Friends</h2>
            <FriendsList friendsList={friends} />
          </div>
        </div>

        {/* right column */}
        <div className="space-y-4">
          <PostNewForm className="order-0 h-min lg:order-none lg:col-span-2" />
          <Feed className="grid gap-4" />
        </div>
      </div>
    </>
  );
};

export default FeedPage;
