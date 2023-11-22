import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { FC, useState } from 'react';

type LikeButtonProps = {
  isLiked: boolean;
  id: string;
  contentType: 'post' | 'comment';
};


const LikeButton: FC<LikeButtonProps> = ({ isLiked, id, contentType }) => {
  const [likeStatus, setLikeStatus] = useState(isLiked);

  

  return isLiked ? (
    <Button variant={'outline'} size={'icon'} onClick={}>
      <Icons.like />
    </Button>
  ) : (
    <Button variant={'outline'} size={'icon'} onClick={}>
      <Icons.dislike />
    </Button>
  );
};

export default LikeButton;
