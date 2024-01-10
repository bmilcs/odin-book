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
import { useNavigate } from 'react-router-dom';

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
              <NotificationItem data={notification} />
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
};

const NotificationItem = ({ data }: { data: TNotification }) => {
  const { markNotificationAsRead, deleteNotification } =
    useContext(NotificationContext);
  const { acceptFriendRequest, rejectFriendRequest } = useFriends();
  const navigate = useNavigate();
  const notificationType = data.type;

  const handleAcceptFriendRequest = async (fromUserId: string) => {
    await acceptFriendRequest(fromUserId);
  };

  const handleRejectFriendRequest = async (fromUserId: string) => {
    await rejectFriendRequest(fromUserId);
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  const handleNewCommentClick = async ({
    notificationId,
    postId,
  }: {
    notificationId: string;
    postId: string;
  }) => {
    await markNotificationAsRead(notificationId);
    navigate(`/posts/${postId}`);
  };

  const handleNewPostClick = async ({
    notificationId,
    postId,
  }: {
    notificationId: string;
    postId: string;
  }) => {
    await markNotificationAsRead(notificationId);
    navigate(`/posts/${postId}`);
  };

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

  if (notificationType === 'new_comment') {
    return (
      <div
        className="flex items-center"
        onClick={() =>
          handleNewCommentClick({
            notificationId: data._id,
            postId: data.post,
          })
        }
      >
        <p>
          <strong>{data.fromUser.username}</strong> commented on your post!
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

  if (notificationType === 'new_post') {
    return (
      <div
        className="flex items-center"
        onClick={() =>
          handleNewPostClick({
            notificationId: data._id,
            postId: data.post,
          })
        }
      >
        <p>
          <strong>{data.fromUser.username}</strong> created a new post!
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
