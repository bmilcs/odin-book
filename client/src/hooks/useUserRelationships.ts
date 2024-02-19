import { useAuthContext } from '@/hooks/useAuthContext';
import { useCallback } from 'react';

const useUserRelationships = () => {
  const { user, friends, friendRequestsReceived, friendRequestsSent } =
    useAuthContext();

  const isUserAFriend = useCallback(
    (id: string) => {
      return friends.some((friend) => friend._id === id);
    },
    [friends],
  );

  const isUserInIncomingFriendRequests = useCallback(
    (id: string) => {
      return friendRequestsReceived.some((request) => request._id === id);
    },
    [friendRequestsReceived],
  );

  const isUserInOutgoingFriendRequests = useCallback(
    (id: string) => {
      return friendRequestsSent.some((request) => request._id === id);
    },
    [friendRequestsSent],
  );

  const isUserTheActiveUser = useCallback(
    (id: string) => {
      return user!._id === id;
    },
    [user],
  );

  return {
    isUserTheActiveUser,
    isUserAFriend,
    isUserInIncomingFriendRequests,
    isUserInOutgoingFriendRequests,
  };
};

export default useUserRelationships;
