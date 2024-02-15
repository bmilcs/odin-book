import CommentEditForm from '@/components/common/comment-edit-form';
import LikeButton from '@/components/common/like-button';
import UserProfileImage from '@/components/common/user-profile-image';
import { Button } from '@/components/ui/button';
import { TComment } from '@/context/feed-provider';
import { useAuthContext } from '@/hooks/useAuthContext';
import useDeleteComment from '@/hooks/useDeleteComment';
import { formatDate } from '@/utils/formatters';
import { ComponentPropsWithoutRef, FC, useState } from 'react';
import { Link } from 'react-router-dom';

type CommentProps = ComponentPropsWithoutRef<'div'> & {
  data: TComment;
};

const Comment: FC<CommentProps> = ({ data, ...props }) => {
  const { deleteComment, status: deleteCommentStatus } = useDeleteComment();
  const { user } = useAuthContext();

  const [comment, setComment] = useState<TComment>(data);
  const [editCommentMode, setEditCommentMode] = useState(false);

  const likeCount = comment.likes.length;
  const isCreatedByUser = comment.author._id.toString() === user!._id;
  const isLikedByUser = comment.likes.some(
    (like) => like.user._id.toString() === user!._id,
  );

  const handleEditCommentButtonClick = () => {
    setEditCommentMode((prev) => !prev);
  };

  const handleSuccessfulEditComment = (commentData: TComment) => {
    setEditCommentMode(false);
    setComment(commentData);
  };

  const handleDeleteComment = () => {
    deleteComment({ postId: comment.post, commentId: comment._id });
  };

  if (deleteCommentStatus === 'success') {
    return null;
  }

  return (
    <div className="flex gap-2" {...props}>
      <UserProfileImage
        user={data.author}
        className="row-span-1 mt-2 h-12 w-12 rounded-full"
      />
      <div>
        <div
          className={`${
            editCommentMode ? 'w-full' : 'w-max'
          } rounded-xl bg-accent p-3`}
        >
          {/* Comment Author & Date Posted */}
          <div className="w-full">
            <div className="text-xs text-foreground">
              <Link
                to={`/users/${comment.author.username}`}
                className="font-bold"
              >
                {comment.author.username}
              </Link>{' '}
              {comment.updatedAt !== comment.createdAt
                ? `edited ${formatDate(comment.updatedAt)}`
                : `posted ${formatDate(comment.createdAt)}`}
            </div>

            {/* Comment Content */}
            {editCommentMode ? (
              <CommentEditForm
                commentId={comment._id}
                postId={comment.post}
                commentContent={comment.content}
                onSuccessfulEditComment={handleSuccessfulEditComment}
              />
            ) : (
              <span>{comment.content}</span>
            )}
          </div>
        </div>
        {/* Buttons */}
        <div className="flex">
          {/* Like Button */}
          <LikeButton
            isLiked={isLikedByUser!}
            likeCount={likeCount!}
            postId={comment.post}
            commentId={comment._id}
            contentType="comment"
          />
          {/* OP Actions: Edit/Delete */}
          {isCreatedByUser && (
            <div className="ml-2 flex gap-2">
              <Button
                variant="link"
                onClick={handleEditCommentButtonClick}
                size="icon"
              >
                Edit
              </Button>
              <Button variant="link" onClick={handleDeleteComment} size="icon">
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
