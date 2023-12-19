import CommentEditForm from '@/components/common/comment-edit-form';
import LikeButton from '@/components/common/like-button';
import { TComment } from '@/components/services/feed-provider';
import { Button } from '@/components/ui/button';
import useExistingComment from '@/hooks/useExistingComment';
import { formatDate } from '@/utils/formatters';
import { useState } from 'react';

const PostComment = ({
  data,
  className,
}: {
  data: TComment;
  className?: string;
}) => {
  const [editCommentMode, setEditCommentMode] = useState(false);
  const { deleteComment } = useExistingComment({
    postId: data.post,
    commentId: data._id,
  });
  const initialIsLikedByUser = data.likes.some(
    (like) => like.user._id.toString() === data.author._id.toString(),
  );
  const initialLikeCount = data.likes.length;
  const isCommentCreatedByUser =
    data.author._id.toString() === data.author._id.toString();

  const handleEditComment = () => {
    setEditCommentMode((prev) => !prev);
  };

  const handleDeleteComment = () => {
    deleteComment();
  };

  const handleSuccessfulEdit = () => {
    setEditCommentMode(false);
  };

  return (
    <div key={data._id} className={`${className} flex justify-between`}>
      {/* Comment Author & Date Posted */}
      <div className="w-full">
        <div className="text-xs text-gray-400">
          {data.author.username}{' '}
          {data.updatedAt !== data.createdAt
            ? `edited ${formatDate(data.updatedAt)}`
            : `posted ${formatDate(data.createdAt)}`}
        </div>

        {/* Comment Content */}
        {editCommentMode ? (
          <CommentEditForm
            commentId={data._id}
            postId={data.post}
            commentContent={data.content}
            onSuccess={() => handleSuccessfulEdit()}
            className="mt-2"
          />
        ) : (
          <span className="text-sm">{data.content}</span>
        )}

        {/* Buttons */}
        <div className="flex">
          {/* Like Button */}
          <LikeButton
            isLiked={initialIsLikedByUser}
            likeCount={initialLikeCount}
            postId={data.post}
            commentId={data._id}
            contentType="comment"
          />
          {/* OP Actions: Edit/Delete */}
          {isCommentCreatedByUser && (
            <div className="ml-8 flex gap-2">
              <Button
                variant="link"
                onClick={() => handleEditComment()}
                size="icon"
              >
                Edit
              </Button>
              <Button
                variant="link"
                onClick={() => handleDeleteComment()}
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
