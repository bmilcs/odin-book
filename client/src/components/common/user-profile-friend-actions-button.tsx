import { Button } from '@/components/ui/button';
import useAcceptFriendRequest from '@/hooks/useAcceptFriendRequest';
import useCancelFriendRequest from '@/hooks/useCancelFriendRequest';
import useDeleteFriend from '@/hooks/useDeleteFriend';
import useRejectFriendRequest from '@/hooks/useRejectFriendRequest';
import useSendFriendRequest from '@/hooks/useSendFriendRequest';
import useUserRelationships from '@/hooks/useUserRelationships';
import { ComponentPropsWithoutRef, FC } from 'react';
import { useNavigate } from 'react-router-dom';

type UserProfileFriendActionsButtonProps =
  ComponentPropsWithoutRef<'button'> & {
    userId: string;
  };

const UserProfileFriendActionsButton: FC<
  UserProfileFriendActionsButtonProps
> = ({ userId, ...props }) => {
  const navigate = useNavigate();
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

  const handleDeleteFriend = async () => {
    await deleteFriend(userId);
    navigate(`/feed`);
  };

  const handleSendFriendRequest = async () => {
    await sendFriendRequest(userId);
  };

  const handleCancelFriendRequest = async () => {
    await cancelFriendRequest(userId);
  };

  const handleAcceptFriendRequest = async () => {
    await acceptFriendRequest(userId);
    navigate(`/feed`);
  };

  const handleRejectFriendRequest = async () => {
    await rejectFriendRequest(userId);
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

export default UserProfileFriendActionsButton;
