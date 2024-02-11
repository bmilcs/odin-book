import LoadingSpinner from '@/components/common/loading-spinner';
import Post from '@/components/common/post';
import { FeedContext } from '@/context/feed-provider';
import { ComponentPropsWithoutRef, FC, useContext } from 'react';

type FeedProps = ComponentPropsWithoutRef<'div'>;

const Feed: FC<FeedProps> = ({ ...props }) => {
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
    <div {...props}>
      {feed.map((post) => (
        <Post key={post._id} data={post} />
      ))}
    </div>
  );
};

export default Feed;
