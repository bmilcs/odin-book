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
import useExistingPost from '@/hooks/useExistingPost';
import { formatDate } from '@/utils/formatters';
import { useContext, useState } from 'react';

const Post = ({
  data,
  className,
  ...props
}: {
  data: TPost;
  className?: string;
}) => {
  const [editPostMode, setEditPostMode] = useState(false);
  const { deletePost } = useExistingPost({ postId: data._id });
  const { user } = useContext(AuthContext);

  const initialPostLikeCount = data.likes.length;
  const initialIsLikedByUser = data.likes.some(
    (like) => like.user._id.toString() === user?._id.toString(),
  );
  const isPostCreatedByUser =
    data.author._id.toString() === user?._id.toString();

  const handleEditPost = () => {
    setEditPostMode((prev) => !prev);
  };

  const handleDeletePost = () => {
    deletePost();
  };

  const handleSuccessfulEdit = () => {
    setEditPostMode(false);
  };

  return (
    <Card className={className} {...props}>
      {/* Post Author & Date Posted */}
      <CardHeader className="flex items-start">
        <div className="space-y-1">
          <CardTitle>{data.author.username}</CardTitle>
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
            onSuccess={() => {
              handleSuccessfulEdit();
            }}
          />
        ) : (
          <p>{data.content}</p>
        )}
      </CardContent>

      {/* Buttons */}
      <CardContent className="border-y-2 py-2">
        <div className="flex justify-between">
          {/* Like Button */}
          <LikeButton
            isLiked={initialIsLikedByUser}
            postId={data._id}
            contentType="post"
            likeCount={initialPostLikeCount}
          />
          {/* OP Action Buttons: Edit/Delete */}
          {isPostCreatedByUser && (
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditPost()}
              >
                <Icons.edit />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeletePost()}
              >
                <Icons.delete />
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* Comments */}
      <CardContent className="grid gap-4 py-4">
        {data.comments.map((comment) => (
          <Comment key={comment._id} data={comment} className="" />
        ))}
        <CommentForm postId={data._id} className="" />
      </CardContent>
    </Card>
  );
};

export default Post;
