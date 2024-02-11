import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthContext } from '@/context/auth-provider';
import { ComponentPropsWithoutRef, FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

type UserSummaryProps = ComponentPropsWithoutRef<'div'> & {
  // ...
};

const UserSummary: FC<UserSummaryProps> = ({ ...props }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFindFriends = () => {
    navigate('/friends');
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl">{user?.username}</CardTitle>
        <CardDescription>{user?.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {user?.friends.length === 0 ? (
          <p>No Friends</p>
        ) : (
          <p>{user?.friends.length} Friends</p>
        )}

        <Button
          onClick={handleFindFriends}
          variant="default"
          className="w-full"
        >
          Find Friends
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserSummary;
