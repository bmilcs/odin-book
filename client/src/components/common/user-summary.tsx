import { AuthContext } from '@/components/services/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
        <CardTitle>
          <h2 className="text-2xl font-semibold">{user?.username}</h2>
        </CardTitle>
        <CardDescription>
          <p>{user?.email}</p>
        </CardDescription>
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
