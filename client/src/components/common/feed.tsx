import LoadingSpinner from '@/components/common/loading-spinner';
import Post from '@/components/common/post';
import { FeedContext } from '@/components/services/feed-provider';
import { useContext } from 'react';

const Feed = () => {
  const { feed, updateFeed, status, error } = useContext(FeedContext);

  const handleSuccessfulEditPost = () => {
    updateFeed();
  };

  const handleSuccessfulDeletePost = () => {
    updateFeed();
  };

  if (status === 'loading') {
    return (
      <div className="grid h-full w-full place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'error') {
    return <div>{error}</div>;
  }

  return (
    <div className="mx-auto my-4 max-w-5xl">
      {feed.map((post) => (
        <Post
          key={post._id}
          data={post}
          className="my-8"
          onSuccessfulEditPost={handleSuccessfulEditPost}
          onSuccessfulDeletePost={handleSuccessfulDeletePost}
        />
      ))}
    </div>
  );
};

export default Feed;
