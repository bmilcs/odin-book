import Comment from '@/components/common/comment';
import CommentForm from '@/components/common/comment-form';
import LikeButton from '@/components/common/like-button';
import PostEditForm from '@/components/common/post-edit-form';
import { AuthContext } from '@/components/services/auth-provider';
import { TPost } from '@/components/services/feed-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import usePost from '@/hooks/usePost';
import { formatDate } from '@/utils/formatters';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

const Post = ({
  data,
  className,
  onSuccessfulEditPost,
  onSuccessfulDeletePost,
  ...props
}: {
  onSuccessfulEditPost: () => void;
  onSuccessfulDeletePost: () => void;
  data: TPost;
  className?: string;
}) => {
  const [editPostMode, setEditPostMode] = useState(false);
  const { deletePost, status: deletePostStatus } = usePost();
  const { user } = useContext(AuthContext);

  const isCreatedByUser = data.author._id.toString() === user?._id.toString();
  const likeCount = data.likes.length;
  const isLikedByUser = data.likes.some(
    (like) => like.user._id.toString() === user?._id.toString(),
  );

  const handleEditPostButtonClick = () => {
    setEditPostMode((prev) => !prev);
  };

  const handleDeletePost = () => {
    deletePost({ postId: data._id });
  };

  const handleSuccessfulEditPost = () => {
    setEditPostMode(false);
    onSuccessfulEditPost();
  };

  const handleSuccessfulNewComment = () => {
    onSuccessfulEditPost();
  };

  const handleSuccessfulEditComment = () => {
    onSuccessfulEditPost();
  };

  const handleSuccessfulDeleteComment = () => {
    onSuccessfulEditPost();
  };

  if (deletePostStatus === 'success') {
    onSuccessfulDeletePost();
  }

  return (
    <Card className={`${className}`} {...props}>
      {/* Post Author & Date Posted */}
      <CardHeader className="flex items-start">
        <div>
          <CardTitle>
            <Link to={`/users/${data.author.username}`}>
              {data.author.username}
            </Link>
          </CardTitle>
          <CardDescription className="ml-auto font-normal">
            {data.updatedAt !== data.createdAt
              ? `edited ${formatDate(data.updatedAt)}`
              : `posted ${formatDate(data.createdAt)}`}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Post content */}
      <CardContent>
        {editPostMode ? (
          <PostEditForm
            postId={data._id}
            postContent={data.content}
            onSuccessfulEditPost={handleSuccessfulEditPost}
          />
        ) : (
          <p>{data.content}</p>
        )}
      </CardContent>

      {/* Buttons */}
      <CardContent className="border-b-2">
        <div className="flex justify-between">
          {/* Like Button */}
          <LikeButton
            isLiked={isLikedByUser}
            postId={data._id}
            contentType="post"
            likeCount={likeCount}
          />
          {/* OP Action Buttons: Edit/Delete */}
          {isCreatedByUser && (
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEditPostButtonClick}
              >
                <Icons.edit />
                <span className="sr-only">Edit Post</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDeletePost}>
                <Icons.delete />
                <span className="sr-only">Delete Post</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* Comments */}
      <CardContent className="grid gap-4 p-5">
        {data.comments.map((comment) => (
          <Comment
            key={comment._id}
            data={comment}
            className=""
            onSuccessfulDeleteComment={handleSuccessfulDeleteComment}
            onSuccessfulEditComment={handleSuccessfulEditComment}
          />
        ))}
        <CommentForm
          postId={data._id}
          className=""
          onSuccessfulNewComment={handleSuccessfulNewComment}
        />
      </CardContent>
    </Card>
  );
};

export default Post;
