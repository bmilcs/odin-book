import LikeButton from '@/components/common/like-button';
import { TComment } from '@/components/services/feed-provider';
import { Button } from '@/components/ui/button';
import useExistingComment from '@/hooks/useExistingComment';
import { formatDate } from '@/utils/formatters';

const PostComment = ({
  data,
  className,
}: {
  data: TComment;
  className?: string;
}) => {
  const { updateComment, deleteComment } = useExistingComment({
    postId: data.post,
    commentId: data._id,
  });
  const initialIsLikedByUser = data.likes.some(
    (like) => like.user._id.toString() === data.author._id.toString(),
  );
  const initialLikeCount = data.likes.length;
  const isCommentCreatedByUser =
    data.author._id.toString() === data.author._id.toString();

  return (
    <div key={data._id} className={`${className} flex justify-between`}>
      {/* Comment Content */}
      {/* With Author & Date Posted */}
      <div className="w-full">
        <div className="text-xs text-gray-400">
          {data.author.username}{' '}
          {data.updatedAt
            ? `edited ${formatDate(data.updatedAt)}`
            : formatDate(data.createdAt)}
        </div>
        <span className="text-sm">{data.content}</span>

        {/* Buttons */}
        <div className="flex">
          <LikeButton
            isLiked={initialIsLikedByUser}
            likeCount={initialLikeCount}
            postId={data.post}
            commentId={data._id}
            contentType="comment"
          />
          {isCommentCreatedByUser && (
            <div className="ml-8 flex gap-2">
              <Button
                variant="link"
                onClick={() => updateComment({ content: 'NewCommentHere' })}
                size="icon"
              >
                Edit
              </Button>
              <Button
                variant="link"
                onClick={() => deleteComment()}
                size="icon"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostComment;
