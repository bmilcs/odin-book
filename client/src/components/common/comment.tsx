import CommentEditForm from '@/components/common/comment-edit-form';
import LikeButton from '@/components/common/like-button';
import { AuthContext } from '@/components/services/auth-provider';
import { TComment } from '@/components/services/feed-provider';
import { Button } from '@/components/ui/button';
import useComment from '@/hooks/useComment';
import { formatDate } from '@/utils/formatters';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

const Comment = ({
  data,
  className,
  onSuccessfulEditComment,
  onSuccessfulDeleteComment,
}: {
  data: TComment;
  className?: string;
  onSuccessfulEditComment: () => void;
  onSuccessfulDeleteComment: () => void;
}) => {
  const [editCommentMode, setEditCommentMode] = useState(false);
  const { deleteComment, status: deleteCommentStatus } = useComment();
  const { user } = useContext(AuthContext);

  const likeCount = data.likes.length;
  const isCreatedByUser = data.author._id.toString() === user?._id;
  const isLikedByUser = data.likes.some((like) => {
    return like.user._id.toString() === user?._id;
  });

  const handleDeleteComment = () => {
    deleteComment({ postId: data.post, commentId: data._id });
  };

  const handleEditComment = () => {
    setEditCommentMode((prev) => !prev);
  };

  const handleSuccessfulEditComment = () => {
    setEditCommentMode(false);
    onSuccessfulEditComment();
  };

  if (deleteCommentStatus === 'success') {
    onSuccessfulDeleteComment();
  }

  return (
    <div key={data._id}>
      <div
        className={`${className} ${
          editCommentMode ? 'w-full' : 'w-max'
        } rounded-xl bg-accent p-3`}
      >
        {/* Comment Author & Date Posted */}
        <div className="w-full">
          <div className="text-xs text-foreground">
            <Link to={`/users/${data.author.username}`} className="font-bold">
              {data.author.username}
            </Link>{' '}
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
              onSuccessfulEditComment={handleSuccessfulEditComment}
              className="mt-2 w-full"
            />
          ) : (
            <span>{data.content}</span>
          )}
        </div>
      </div>
      {/* Buttons */}
      <div className="flex">
        {/* Like Button */}
        <LikeButton
          isLiked={isLikedByUser}
          likeCount={likeCount}
          postId={data.post}
          commentId={data._id}
          contentType="comment"
        />
        {/* OP Actions: Edit/Delete */}
        {isCreatedByUser && (
          <div className="ml-2 flex gap-2">
            <Button variant="link" onClick={handleEditComment} size="icon">
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
