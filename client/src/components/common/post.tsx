import CommentForm from '@/components/common/comment-form';
import LikeButton from '@/components/common/like-button';
import PostComment from '@/components/common/post-comment';
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
import { useContext } from 'react';

const Post = ({
  data,
  className,
  ...props
}: {
  data: TPost;
  className?: string;
}) => {
  const { deletePost, updatePost } = useExistingPost({ postId: data._id });
  const { user } = useContext(AuthContext);
  const initialPostLikeCount = data.likes.length;
  const initialIsLikedByUser = data.likes.some(
    (like) => like.user._id.toString() === user?._id.toString(),
  );
  const isPostCreatedByUser =
    data.author._id.toString() === user?._id.toString();

  console.log(data.comments);

  return (
    <Card className={className} {...props}>
      {/* Post Author & Date Posted */}
      <CardHeader className="flex items-start">
        <div className="space-y-1">
          <CardTitle>{data.author.username}</CardTitle>
          <CardDescription className="ml-auto font-normal">
            {formatDate(data.createdAt)}
          </CardDescription>
        </div>
      </CardHeader>
      {/* Post content */}
      <CardContent>
        <p>{data.content}</p>
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
                onClick={() => updatePost({ content: 'New Post Data!' })}
              >
                <Icons.edit />
              </Button>
              <Button variant="ghost" onClick={() => deletePost()} size="icon">
                <Icons.delete />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      {/* Comments */}
      <CardContent className="grid gap-4 py-4">
        <CommentForm postId={data._id} className="" />
        {data.comments.map((comment) => (
          <PostComment key={comment._id} data={comment} className="pl-4" />
        ))}
      </CardContent>
    </Card>
  );
};

export default Post;
