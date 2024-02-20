import UserImage from '@/components/common/user-image';
import { TFindFriendsUser } from '@/utils/types';
import { ComponentPropsWithoutRef, FC } from 'react';

type FindFriendsUserCardProps = ComponentPropsWithoutRef<'div'> & {
  user: TFindFriendsUser;
  className?: string;
};

const FindFriendsUserCard: FC<FindFriendsUserCardProps> = ({
  user,
  className = '',
  ...props
}) => {
  return (
    <div
      key={user._id}
      className={`relative overflow-hidden rounded-xl border-2 bg-border shadow-md transition-transform hover:scale-105 ${className}`}
      {...props}
    >
      <p className="border-1 pointer-events-none absolute inset-x-1 bottom-2 z-20 break-all rounded-xl px-2 text-center font-bold text-primary-foreground dark:text-foreground">
        {user.username}
      </p>
      <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-1/2 bg-gradient-to-t from-[rgba(0,0,0,.4)] dark:bg-gradient-to-t dark:from-background" />
      <UserImage user={user} className="aspect-square h-full object-cover" />
    </div>
  );
};

export default FindFriendsUserCard;
