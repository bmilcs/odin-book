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
    <div className="grid grid-cols-[max-content_1fr] gap-2" {...props}>
      <UserProfileImage
        user={data.author}
        className="row-span-1 mt-3 aspect-square w-10 rounded-full sm:mt-2 sm:w-12"
      />

      <div>
        <div
          className={`${
            editCommentMode ? 'w-full' : 'max-w-max'
          } rounded-xl bg-accent p-3`}
        >
          {/* Comment Author & Date Posted */}
          <p className="text-xs text-foreground">
            <Link
              to={`/users/${comment.author.username}`}
              className="break-words break-all font-bold"
            >
              {comment.author.username}
            </Link>{' '}
            {comment.updatedAt !== comment.createdAt
              ? `edited ${formatDate(comment.updatedAt)}`
              : `posted ${formatDate(comment.createdAt)}`}
          </p>

          {/* Comment Content */}
          {editCommentMode ? (
            <CommentEditForm
              commentId={comment._id}
              postId={comment.post}
              commentContent={comment.content}
              onSuccessfulEditComment={handleSuccessfulEditComment}
            />
          ) : (
            <p className="min-w-0 break-words break-all">{comment.content}</p>
          )}
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
