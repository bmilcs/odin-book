import CommentEditForm from '@/components/common/comment-edit-form';
import LikeButton from '@/components/common/like-button';
import { AuthContext } from '@/components/services/auth-provider';
import { TComment } from '@/components/services/feed-provider';
import { Button } from '@/components/ui/button';
import useExistingComment from '@/hooks/useExistingComment';
import { formatDate } from '@/utils/formatters';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

const Comment = ({
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
  const { user } = useContext(AuthContext);

  const initialIsLikedByUser = data.likes.some((like) => {
    return like.user._id.toString() === user?._id;
  });
  const initialLikeCount = data.likes.length;
  const isCommentCreatedByUser = data.author._id.toString() === user?._id;

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
              onSuccess={handleSuccessfulEdit}
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
          isLiked={initialIsLikedByUser}
          likeCount={initialLikeCount}
          postId={data.post}
          commentId={data._id}
          contentType="comment"
        />
        {/* OP Actions: Edit/Delete */}
        {isCommentCreatedByUser && (
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
