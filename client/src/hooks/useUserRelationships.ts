import { useAuthContext } from '@/hooks/useAuthContext';
import { useCallback } from 'react';

const useUserRelationships = () => {
  const { user } = useAuthContext();

  const isUserAFriend = useCallback(
    (username: string) => {
      return user!.friends.some((friend) => friend.username === username);
    },
    [user],
  );

  const isUserInIncomingFriendRequests = useCallback(
    (username: string) => {
      return user!.friendRequestsReceived.some(
        (request) => request.username === username,
      );
    },
    [user],
  );

  const isUserInOutgoingFriendRequests = useCallback(
    (username: string) => {
      return user!.friendRequestsSent.some(
        (request) => request.username === username,
      );
    },
    [user],
  );

  const isUserTheActiveUser = useCallback(
    (username: string) => {
      return user!.username === username;
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
