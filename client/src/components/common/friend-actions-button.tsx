import { Button } from '@/components/ui/button';
import useAcceptFriendRequest from '@/hooks/useAcceptFriendRequest';
import useCancelFriendRequest from '@/hooks/useCancelFriendRequest';
import useDeleteFriend from '@/hooks/useDeleteFriend';
import useRejectFriendRequest from '@/hooks/useRejectFriendRequest';
import useSendFriendRequest from '@/hooks/useSendFriendRequest';
import useUserRelationships from '@/hooks/useUserRelationships';
import { ComponentPropsWithoutRef, FC } from 'react';

type FriendActionsButtonProps = ComponentPropsWithoutRef<'button'> & {
  userId: string;
};

const FriendActionsButton: FC<FriendActionsButtonProps> = ({
  userId,
  ...props
}) => {
  const { sendFriendRequest } = useSendFriendRequest();
  const { acceptFriendRequest } = useAcceptFriendRequest();
  const { rejectFriendRequest } = useRejectFriendRequest();
  const { cancelFriendRequest } = useCancelFriendRequest();
  const { deleteFriend } = useDeleteFriend();
  const {
    isUserAFriend,
    isUserInIncomingFriendRequests,
    isUserInOutgoingFriendRequests,
  } = useUserRelationships();

  const handleDeleteFriend = () => {
    deleteFriend(userId);
  };

  const handleSendFriendRequest = () => {
    sendFriendRequest(userId);
  };

  const handleCancelFriendRequest = () => {
    cancelFriendRequest(userId);
  };

  const handleAcceptFriendRequest = () => {
    acceptFriendRequest(userId);
  };

  const handleRejectFriendRequest = () => {
    rejectFriendRequest(userId);
  };

  const isFriend = isUserAFriend(userId);
  const isInIncomingFriendRequests = isUserInIncomingFriendRequests(userId);
  const isInOutgoingFriendRequests = isUserInOutgoingFriendRequests(userId);

  return (
    <>
      {isFriend ? (
        <Button onClick={handleDeleteFriend} {...props}>
          Remove Friend
        </Button>
      ) : isInOutgoingFriendRequests ? (
        <Button onClick={handleCancelFriendRequest} {...props}>
          Cancel Friend Request
        </Button>
      ) : isInIncomingFriendRequests ? (
        <>
          <Button onClick={handleAcceptFriendRequest} {...props}>
            Accept Friend Request
          </Button>
          <Button onClick={handleRejectFriendRequest} {...props}>
            Reject Friend Request
          </Button>
        </>
      ) : (
        <Button onClick={handleSendFriendRequest} {...props}>
          Send Friend Request
        </Button>
      )}
    </>
  );
};

export default FriendActionsButton;
