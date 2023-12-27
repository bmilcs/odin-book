import {
  NotificationContext,
  TNotification,
} from '@/components/services/notification-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icons';
import useFriends from '@/hooks/useFriends';
import { useContext } from 'react';

const NotificationIcon = () => {
  const { notifications } = useContext(NotificationContext);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {notifications.length === 0 ? (
            <>
              <Icons.notificationEmpty />
            </>
          ) : (
            <Icons.notificationFilled />
          )}
          <span className="sr-only">Open notification menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification._id}>
              <Notification data={notification} />
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>
            <p>No new notifications</p>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
  edited;
};

const Notification = ({ data }: { data: TNotification }) => {
  const { markNotificationAsRead, deleteNotification } =
    useContext(NotificationContext);
  const { acceptFriendRequest, rejectFriendRequest } = useFriends();
  const notificationType = data.type;

  async function handleAcceptFriendRequest(fromUserId: string) {
    await acceptFriendRequest(fromUserId);
  }

  async function handleRejectFriendRequest(fromUserId: string) {
    await rejectFriendRequest(fromUserId);
  }

  async function handleMarkNotificationAsRead(notificationId: string) {
    await markNotificationAsRead(notificationId);
  }

  async function handleDeleteNotification(notificationId: string) {
    await deleteNotification(notificationId);
  }

  if (notificationType === 'incoming_friend_request') {
    return (
      <div
        className="flex items-center"
        onClick={() => handleMarkNotificationAsRead(data._id)}
      >
        <p>
          <strong>{data.fromUser.username}</strong> wants to be friends!
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAcceptFriendRequest(data.fromUser._id)}
        >
          <Icons.add />
          <span className="sr-only">
            Accept friend request from {data.fromUser.username}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRejectFriendRequest(data.fromUser._id)}
        >
          <Icons.remove />
          <span className="sr-only">
            Reject friend request from {data.fromUser.username}
          </span>
        </Button>
      </div>
    );
  }

  if (notificationType === 'accepted_friend_request') {
    return (
      <div
        className="flex items-center"
        onClick={() => handleMarkNotificationAsRead(data._id)}
      >
        <p>
          <strong>{data.fromUser.username}</strong> accepted your friend
          request!
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteNotification(data._id)}
        >
          <Icons.delete />
          <span className="sr-only">
            Delete notification from {data.fromUser.username}
          </span>
        </Button>
      </div>
    );
  }
};

export default NotificationIcon;
