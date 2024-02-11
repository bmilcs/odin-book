import { AuthContext } from '@/context/auth-provider';
import { FeedContext } from '@/context/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useCallback, useContext, useState } from 'react';

type ApiResponse = {
  success: boolean;
  message: string;
  error: string;
};

const useFriends = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const { updateFeed } = useContext(FeedContext);
  const { user, updateUserData } = useContext(AuthContext);

  const sendFriendRequest = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!userId) {
      setStatus(STATUS.ERROR);
      setError('User ID is required');
      return;
    }

    try {
      const { success, error } = await api.post<ApiResponse>(
        `/friends/send-request/${userId}`,
        {},
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        await updateUserData();
        return;
      }
      setStatus(STATUS.ERROR);
      setError(error);
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(error);
    }
  };

  const cancelFriendRequest = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!userId) {
      setStatus(STATUS.ERROR);
      setError('User ID is required');
      return;
    }

    try {
      const { success, error } = await api.del<ApiResponse>(
        `/friends/cancel-request/${userId}`,
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        await updateUserData();
        return;
      }
      setStatus(STATUS.ERROR);
      setError(error);
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(error);
    }
  };

  const acceptFriendRequest = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!userId) {
      setStatus(STATUS.ERROR);
      setError('User ID is required');
      return;
    }

    try {
      const { success, error } = await api.patch<ApiResponse>(
        `/friends/accept-request/${userId}`,
        {},
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        await updateFeed();
        await updateUserData();
        return;
      }
      setStatus(STATUS.ERROR);
      setError(error);
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(error);
    }
  };

  const rejectFriendRequest = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!userId) {
      setStatus(STATUS.ERROR);
      setError('User ID is required');
      return;
    }

    try {
      const { success, error } = await api.patch<ApiResponse>(
        `/friends/reject-request/${userId}`,
        {},
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        await updateUserData();
        return;
      }
      setStatus(STATUS.ERROR);
      setError(error);
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(error);
    }
  };

  const deleteFriend = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!userId) {
      setStatus(STATUS.ERROR);
      setError('User ID is required');
      return;
    }

    try {
      const { success, error } = await api.del<ApiResponse>(
        `/friends/${userId}`,
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        await updateFeed();
        await updateUserData();
        return;
      }
      setStatus(STATUS.ERROR);
      setError(error);
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(error);
    }
  };

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
    status,
    error,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriend,
    isUserTheActiveUser,
    isUserAFriend,
    isUserInIncomingFriendRequests,
    isUserInOutgoingFriendRequests,
  };
};

export default useFriends;
