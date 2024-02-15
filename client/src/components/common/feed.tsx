import LoadingSpinner from '@/components/common/loading-spinner';
import Post from '@/components/common/post';
import { useFeedContext } from '@/hooks/useFeedContext';
import { ComponentPropsWithoutRef, FC } from 'react';

type FeedProps = ComponentPropsWithoutRef<'div'>;

const Feed: FC<FeedProps> = ({ ...props }) => {
  const { feed, status, error } = useFeedContext();

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
