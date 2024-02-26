import UserImage from '@/components/common/user-image';
import { Button } from '@/components/ui/button';
import { TFriend } from '@/utils/types';
import { ComponentPropsWithoutRef, FC } from 'react';
import { useNavigate } from 'react-router-dom';

type FriendsListProps = ComponentPropsWithoutRef<'div'> & {
  friendsList: TFriend[];
  className?: string;
};

const FriendsList: FC<FriendsListProps> = ({
  friendsList,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();

  const handleFriendClick = (username: string) => {
    navigate(`/users/${username}`);
  };

  return (
    <div className={`${className} grid`} {...props}>
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
};

export default FriendsList;
