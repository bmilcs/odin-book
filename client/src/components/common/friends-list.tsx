import UserProfileImage from '@/components/common/user-profile-image';
import { useAuthContext } from '@/hooks/useAuthContext';
import { TFriend, TUser } from '@/utils/types';
import { ComponentPropsWithoutRef, FC } from 'react';
import { Link } from 'react-router-dom';

type FriendsListProps = ComponentPropsWithoutRef<'div'> & {
  className?: string;
  propUser?: TUser;
};

const FriendsList: FC<FriendsListProps> = ({
  propUser,
  className = '',
  ...props
}) => {
  const { user: activeUser } = useAuthContext();
  const user = propUser || activeUser;
  const friends = user?.friends || [];

  return (
    <div className={`${className} grid`} {...props}>
      {friends.map((friend: TFriend) => (
        <div key={friend._id} className="p-1 hover:rounded-md hover:bg-accent">
          <div key={friend._id} className="flex items-center gap-4">
            <UserProfileImage user={friend} className="h-8 rounded-full" />
            <Link to={`/users/${friend.username}`} className="text-sm">
              {friend.username}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;
