import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import useLike from '@/hooks/useLike';
import { FC } from 'react';

type LikeButtonProps = {
  isLiked: boolean;
  _id: string;
  contentType: 'post' | 'comment';
  likeCount: number;
};

const LikeButton: FC<LikeButtonProps> = ({
  isLiked,
  _id,
  contentType,
  likeCount,
}) => {
  const { status, error, likeStatus, toggleLike, totalLikes } = useLike({
    _id,
    contentType,
    isLiked,
    likeCount,
  });

  return (
    <div className="flex items-center gap-2 text-sm">
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={toggleLike}
        disabled={status === 'loading' || !!error}
      >
        {likeStatus ? (
          <Icons.like className="text-blue-500 dark:text-blue-400" />
        ) : (
          <Icons.dislike />
        )}
      </Button>
      <span>{totalLikes} Likes</span>
    </div>
  );
};

export default LikeButton;
