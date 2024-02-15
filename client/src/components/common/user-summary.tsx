import UserProfileImage from '@/components/common/user-profile-image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { useAuthContext } from '@/hooks/useAuthContext';
import { ComponentPropsWithoutRef, FC } from 'react';
import { useNavigate } from 'react-router-dom';

type UserSummaryProps = ComponentPropsWithoutRef<'div'> & {
  // ...
};

const UserSummary: FC<UserSummaryProps> = ({ ...props }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleFindFriends = () => {
    navigate('/friends');
  };

  return (
    <Card {...props}>
      <CardContent>
        <div className="items-center justify-between gap-4 space-y-2 sm:flex md:gap-10 lg:block">
          <UserProfileImage className="w-full object-cover sm:max-w-xs" />
          <div className="flex-grow">
            <CardTitle className="text-2xl">{user?.username}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>

            <div className="py-5">
              {user?.friends.length === 0 ? (
                <p>No Friends</p>
              ) : (
                <p>{user?.friends.length} Friends</p>
              )}
            </div>

            <Button
              onClick={handleFindFriends}
              variant="default"
              className="md:mx-center w-full md:max-w-md"
            >
              Find More Friends
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSummary;
