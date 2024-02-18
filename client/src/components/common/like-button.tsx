import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import useLikeToggle from '@/hooks/useToggleLike';
import { ComponentPropsWithoutRef, FC } from 'react';

type LikeButtonProps = ComponentPropsWithoutRef<'div'> & {
  contentType: 'post' | 'comment';
  isLiked: boolean;
  postId: string;
  commentId?: string;
  likeCount: number;
};

const LikeButton: FC<LikeButtonProps> = ({
  contentType,
  postId,
  commentId,
  isLiked,
  likeCount,
  ...props
}) => {
  const { status, error, likeStatus, toggleLike, totalLikes } = useLikeToggle({
    commentId,
    postId,
    contentType,
    isLiked,
    likeCount,
  });

  const handleToggleLike = () => {
    toggleLike();
  };

  return (
    <div className="flex items-center text-sm" {...props}>
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={handleToggleLike}
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
