import LoadingSpinner from '@/components/common/loading-spinner';
import Post from '@/components/common/post';
import { FeedContext } from '@/components/services/feed-provider';
import { useContext } from 'react';

const Feed = () => {
  const { feed, status, error } = useContext(FeedContext);

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
    <div className="my-4 ml-auto max-w-3xl">
      {feed.map((post) => (
        <Post key={post._id} data={post} className="my-4" />
      ))}
    </div>
  );
};

export default Feed;
