import { AuthContext, TUser } from '@/components/services/auth-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icons';
import useFriends from '@/hooks/useFriends';
import { useContext, useEffect, useState } from 'react';

export type TNotification = {
  type: string;
  fromUser: TUser;
  toUser: string;
  post: string;
  read: boolean;
  _id: string;
};

const NotificationIcon = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<TNotification[]>([]);

  useEffect(() => {
    setNotifications(user?.notifications || []);
  }, [user?.notifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="animate-bounce">
          <Icons.notificationEmpty />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification._id}>
            <Notification data={notification} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Notification = ({ data }: { data: TNotification }) => {
  const notificationType = data.type;
  const { acceptFriendRequest, rejectFriendRequest } = useFriends();

  function handleAcceptFriendRequest(fromUserId: string) {
    acceptFriendRequest(fromUserId);
  }

  function handleRejectFriendRequest(fromUserId: string) {
    rejectFriendRequest(fromUserId);
  }

  if (notificationType === 'incoming_friend_request') {
    return (
      <div>
        <strong>{data.fromUser.username}</strong> wants to be friends!
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAcceptFriendRequest(data.fromUser._id)}
        >
          <Icons.add />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRejectFriendRequest(data.fromUser._id)}
        >
          <Icons.remove />
        </Button>
      </div>
    );
  }

  if (notificationType === 'accepted_friend_request') {
    return (
      <div>
        <strong>{data.fromUser.username}</strong> accepted your friend request!
      </div>
    );
  }
};

export default NotificationIcon;
