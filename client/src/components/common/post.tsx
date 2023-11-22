import LikeButton from '@/components/common/like-button';
import { AuthContext } from '@/components/services/auth-provider';
import { TPost } from '@/components/services/feed-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  const { user } = useContext(AuthContext);
  const isLikedByUser = data.likes.includes(user._id) || false;
  const likeCount = data.likes.length;

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>{data.author.username} </CardTitle>
          <CardDescription className="ml-auto font-normal">
            {formatDate(data.createdAt)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>{data.content}</CardContent>
      <CardFooter>
        <LikeButton isLiked={isLikedByUser} />
        <span className="ml-2 text-sm">{likeCount} Likes</span>
      </CardFooter>
    </Card>
  );
};

export default Post;
