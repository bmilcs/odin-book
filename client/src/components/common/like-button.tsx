import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import useLike from '@/hooks/useLike';
import { FC } from 'react';

type LikeButtonProps = {
  isLiked: boolean;
  postId: string;
  commentId?: string;
  contentType: 'post' | 'comment';
  likeCount: number;
};

const LikeButton: FC<LikeButtonProps> = ({
  isLiked,
  postId,
  contentType,
  likeCount,
  commentId,
}) => {
  const { status, error, likeStatus, toggleLike, totalLikes } = useLike({
    commentId,
    postId,
    contentType,
    isLiked,
    likeCount,
  });

  return (
    <div className="flex items-center text-sm">
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={toggleLike}
        disabled={status === 'loading' || !!error}
      >
        {likeStatus ? (
          <>
            <Icons.like className="text-blue-500 dark:text-blue-400" />
            <span className="sr-only">Unlike ${contentType}</span>
          </>
        ) : (
          <>
            <Icons.dislike />
            <span className="sr-only">Like ${contentType}</span>
          </>
        )}
      </Button>
      <span>{totalLikes}</span>
    </div>
  );
};

export default LikeButton;
