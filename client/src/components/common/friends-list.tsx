import UserImage from '@/components/common/user-image';
import { Button } from '@/components/ui/button';
import { TFriend } from '@/utils/types';
import { ComponentPropsWithoutRef, FC } from 'react';
import { useNavigate } from 'react-router-dom';

type FriendsListProps = ComponentPropsWithoutRef<'div'> & {
  friendsList: TFriend[];
  className?: string;
  variant?: 'list' | 'grid';
};

const FriendsList: FC<FriendsListProps> = ({
  friendsList,
  variant = 'list',
  className = '',
  ...props
}) => {
  const navigate = useNavigate();

  const handleFriendClick = (username: string) => {
    navigate(`/users/${username}`);
  };

  if (variant === 'list') {
    return (
      <div className={`grid ${className}`} {...props}>
        {friendsList.map((friend: TFriend) => (
          <Button
            variant={'ghost'}
            onClick={() => handleFriendClick(friend.username)}
            key={friend._id}
            className="pl-1 hover:rounded-md hover:bg-accent"
          >
            <div className="flex w-full items-center gap-4">
              <UserImage
                user={friend}
                linkToProfile={false}
                className="h-8 rounded-full"
              />
              <p className="text-sm">{friend.username}</p>
            </div>
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'grid')
    return (
      <div
        className={`grid-cols-auto-fill-75 grid gap-2 ${className}`}
        {...props}
      >
        {friendsList.map((friend: TFriend) => (
          <Button
            variant={'ghost'}
            onClick={() => handleFriendClick(friend.username)}
            key={friend._id}
            className="grid aspect-square h-auto gap-1 p-0 transition-transform hover:scale-110 hover:bg-background"
          >
            <UserImage
              user={friend}
              linkToProfile={false}
              className="rounded-full"
            />
            <p className="break-words">{friend.username}</p>
          </Button>
        ))}
      </div>
    );
};

export default FriendsList;
