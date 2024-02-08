import Comment from '@/components/common/comment';
import CommentNewForm from '@/components/common/comment-new-form';
import LikeButton from '@/components/common/like-button';
import PostEditForm from '@/components/common/post-edit-form';
import { AuthContext } from '@/components/services/auth-provider';
import { TComment, TPost } from '@/components/services/feed-provider';
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
import { ComponentPropsWithoutRef, FC, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

type PostProps = ComponentPropsWithoutRef<'div'> & {
  data: TPost;
};

const NUMBER_OF_COMMENTS_TO_SHOW = 3;

const Post: FC<PostProps> = ({ data, ...props }) => {
  const [post, setPost] = useState<TPost>(data);
  const [editPostMode, setEditPostMode] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const { user } = useContext(AuthContext);
  const { deletePost, status: deletePostStatus } = usePost();

  const likeCount = post.likes.length;
  const isCreatedByUser = post.author._id.toString() === user!._id.toString();
  const isLikedByUser = post.likes.some(
    (like) => like.user._id.toString() === user!._id.toString(),
  );

  const handleEditPostButtonClick = () => {
    setEditPostMode((prev) => !prev);
  };

  const handleSuccessfulEditPost = (newPost: TPost) => {
    setEditPostMode(false);
    setPost(newPost);
  };

  const handleSuccessfulNewComment = (commentData: TComment) => {
    setPost((prev) => ({
      ...prev,
      comments: [...prev.comments, commentData],
    }));
  };

  const handleToggleShowAllComments = () => {
    setShowAllComments((prev) => !prev);
  };

  const handleDeletePost = () => {
    deletePost({ postId: post._id });
  };

  if (deletePostStatus === 'success') {
    return null;
  }

  return (
    <Card {...props}>
      {/* Post Author & Date Posted */}
      <CardHeader className="flex items-start">
        <div>
          <CardTitle>
            <Link to={`/users/${post.author.username}`}>
              {post.author.username}
            </Link>
          </CardTitle>
          <CardDescription className="ml-auto font-normal">
            {post.updatedAt !== post.createdAt
              ? `edited ${formatDate(post.updatedAt)}`
              : `posted ${formatDate(post.createdAt)}`}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Post content */}
      <CardContent>
        {editPostMode ? (
          <PostEditForm
            postId={post._id}
            postContent={post.content}
            onSuccessfulEditPost={handleSuccessfulEditPost}
          />
        ) : (
          <p>{post.content}</p>
        )}
      </CardContent>

      {/* Post Buttons */}
      <CardContent className="border-b-2">
        <div className="flex justify-between">
          {/* Like Button */}
          <LikeButton
            isLiked={isLikedByUser}
            postId={post._id}
            contentType="post"
            likeCount={likeCount}
          />

          {/* Post OP Action Buttons: Edit/Delete */}
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
        {/* List of comments */}
        {post.comments.map((comment, i) => {
          if (showAllComments) {
            return <Comment key={comment._id} data={comment} />;
          }

          if (i < NUMBER_OF_COMMENTS_TO_SHOW) {
            return <Comment key={comment._id} data={comment} />;
          }
        })}

        {/* Show all comments toggle button */}
        {post.comments.length > NUMBER_OF_COMMENTS_TO_SHOW && (
          <Button variant="link" onClick={handleToggleShowAllComments}>
            {showAllComments
              ? 'Hide extra comments'
              : `Show all ${post.comments.length} comments`}
          </Button>
        )}

        {/* Add new comment */}
        <CommentNewForm
          postId={post._id}
          onSuccessfulNewComment={handleSuccessfulNewComment}
        />
      </CardContent>
    </Card>
  );
};

export default Post;
