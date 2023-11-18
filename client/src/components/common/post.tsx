import { TPost } from '@/components/services/feed-provider';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate } from '@/utils/formatters';

const Post = ({
  data,
  className,
  ...props
}: {
  data: TPost;
  className?: string;
}) => {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>{data.content}</CardTitle>
          <CardDescription>
            Posted by <strong>{data.author.username}</strong>{' '}
            {formatDate(data.createdAt)}
          </CardDescription>
        </div>
        <CardTitle></CardTitle>
      </CardHeader>
    </Card>
  );
};

export default Post;
