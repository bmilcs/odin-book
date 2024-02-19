import UserImage from '@/components/common/user-image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icons';
import { useNotificationContext } from '@/hooks/useNotificationContext';
import { TNotification } from '@/utils/types';
import { useNavigate } from 'react-router-dom';

const NUMBER_OF_NOTIFICATIONS_TO_SHOW = 5;

const NotificationIcon = ({ ...props }) => {
  const {
    notifications,
    markAllNotificationsAsRead,
    getAllNotifications,
    deleteAllNotifications,
  } = useNotificationContext();

  const handleMarkAllNotificationsAsRead = async () => {
    await markAllNotificationsAsRead();
  };

  const handleGetAllNotifications = async () => {
    await getAllNotifications();
  };

  const handleDeleteAllNotifications = async () => {
    await deleteAllNotifications();
  };

  return (
    <DropdownMenu {...props}>
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
          <>
            {notifications
              .filter((_, index) => index < NUMBER_OF_NOTIFICATIONS_TO_SHOW)
              .map((notification) => (
                <DropdownMenuItem key={notification._id}>
                  <NotificationItem data={notification} />
                </DropdownMenuItem>
              ))}
            <DropdownMenuItem>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleMarkAllNotificationsAsRead}
              >
                Mark All Notifications As Read
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDeleteAllNotifications}
              >
                Delete All Notifications
              </Button>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>
              <p>No new notifications</p>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGetAllNotifications}
              >
                Get Old Notifications
              </Button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NotificationItem = ({ data }: { data: TNotification }) => {
  const { markNotificationAsRead } = useNotificationContext();
  const navigate = useNavigate();

  const handleNewCommentClick = async () => {
    await markNotificationAsRead(data._id);
    navigate(`/posts/${data.post}`);
  };

  const handleNewPostClick = async () => {
    await markNotificationAsRead(data._id);
    navigate(`/posts/${data.post}`);
  };

  const handleOtherNotificationClick = async () => {
    await markNotificationAsRead(data._id);
    navigate(`/users/${data.fromUser.username}`);
  };

  const notificationType = data.type;

  if (notificationType === 'incoming_friend_request') {
    return (
      <div
        className="flex items-center gap-2"
        onClick={handleOtherNotificationClick}
      >
        <UserImage user={data.fromUser} className="h-8 w-8 rounded-full" />
        <p>
          <span className="font-bold">{data.fromUser.username}</span> wants to
          be friends!
        </p>
      </div>
    );
  }

  if (notificationType === 'accepted_friend_request') {
    return (
      <div
        className="flex items-center gap-2"
        onClick={handleOtherNotificationClick}
      >
        <UserImage user={data.fromUser} className="h-8 w-8 rounded-full" />
        <p>
          <span className="font-bold">{data.fromUser.username}</span> accepted
          your friend request!
        </p>
      </div>
    );
  }

  if (notificationType === 'new_comment') {
    return (
      <div className="flex items-center gap-2" onClick={handleNewCommentClick}>
        <UserImage user={data.fromUser} className="h-8 w-8 rounded-full" />
        <p>
          <span className="font-bold">{data.fromUser.username}</span> commented
          on your post!
        </p>
      </div>
    );
  }

  if (notificationType === 'new_post') {
    return (
      <div className="flex items-center gap-2" onClick={handleNewPostClick}>
        <UserImage user={data.fromUser} className="h-8 w-8 rounded-full" />
        <p>
          <span className="font-bold">{data.fromUser.username}</span> created a
          new post!
        </p>
      </div>
    );
  }
};

export default NotificationIcon;
