import FindFriendsUserCard from '@/components/common/find-friends-user-card';
import LoadingSpinner from '@/components/common/loading-spinner';
import useFetchAllUsers from '@/hooks/useFetchAllUsers';
import useUserRelationships from '@/hooks/useUserRelationships';
import { TFindFriendsUser } from '@/utils/types';
import { ComponentPropsWithoutRef, FC, useEffect } from 'react';

type FindFriendsPageProps = ComponentPropsWithoutRef<'div'> & {
  className?: string;
};

const FindFriendsPage: FC<FindFriendsPageProps> = ({
  className = '',
  ...props
}) => {
  const { fetchAllUsers, allUsers, status, error } = useFetchAllUsers();
  const { isUserAFriend, isUserTheActiveUser } = useUserRelationships();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  if (status === 'error') {
    return <div {...props}>{error}</div>;
  }

  if (status === 'loading') {
    return (
      <div {...props}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div {...props} className={`space-y-4 ${className}`}>
        <p>Find New Friends</p>

        <div className="grid-cols-auto-fill-125 grid gap-4">
          {allUsers
            ?.filter(
              (user: TFindFriendsUser) =>
                !isUserAFriend(user._id) && !isUserTheActiveUser(user._id),
            )
            .map((user: TFindFriendsUser) => (
              <FindFriendsUserCard user={user} key={user._id} />
            ))}
        </div>

        <p>Current Friends</p>

        <div className="grid-cols-auto-fill-125 grid gap-4">
          {allUsers
            ?.filter(
              (user: TFindFriendsUser) =>
                isUserAFriend(user._id) && !isUserTheActiveUser(user._id),
            )
            .map((user: TFindFriendsUser) => (
              <FindFriendsUserCard user={user} key={user._id} />
            ))}
        </div>
      </div>
    </>
  );
};

export default FindFriendsPage;
