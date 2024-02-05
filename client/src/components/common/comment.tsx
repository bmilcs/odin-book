import CommentEditForm from '@/components/common/comment-edit-form';
import LikeButton from '@/components/common/like-button';
import { AuthContext } from '@/components/services/auth-provider';
import { TComment } from '@/components/services/feed-provider';
import { Button } from '@/components/ui/button';
import useComment from '@/hooks/useComment';
import { formatDate } from '@/utils/formatters';
import { ComponentPropsWithoutRef, FC, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

type CommentProps = ComponentPropsWithoutRef<'div'> & {
  data: TComment;
};

const Comment: FC<CommentProps> = ({ data, ...props }) => {
  const [comment, setComment] = useState<TComment>(data);
  const [editCommentMode, setEditCommentMode] = useState(false);
  const { deleteComment, status: deleteCommentStatus } = useComment();
  const { user } = useContext(AuthContext);

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
    <div {...props}>
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
  );
};

export default Comment;
