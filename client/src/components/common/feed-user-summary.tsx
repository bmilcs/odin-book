import UserImage from '@/components/common/user-image';
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

type FeedUserSummaryProps = ComponentPropsWithoutRef<'div'>;

const FeedUserSummary: FC<FeedUserSummaryProps> = ({ ...props }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleFindFriends = () => {
    navigate('/find-friends');
  };

  return (
    <Card {...props}>
      <CardContent>
        <div className="space-y-4 sm:flex sm:items-center sm:justify-normal sm:gap-4 sm:space-y-0 md:gap-10 lg:block lg:space-y-4">
          <UserImage
            user={user}
            className="w-full object-cover sm:max-h-44 sm:max-w-xs lg:max-h-max"
          />

          <div className="space-y-4">
            <div>
              <CardTitle className="break-words break-all text-2xl">
                {user!.username}
              </CardTitle>
              <CardDescription>{user!.email}</CardDescription>
            </div>

            <div className="">
              <p className="mb-2 font-bold">
                {user!.friends?.length > 0 ? user!.friends?.length : 'No'}{' '}
                Friends
              </p>
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

export default FeedUserSummary;
