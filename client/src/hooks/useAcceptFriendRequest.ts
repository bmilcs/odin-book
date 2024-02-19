import { useAuthContext } from '@/hooks/useAuthContext';
import { useFeedContext } from '@/hooks/useFeedContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TFriend } from '@/utils/types';
import { useState } from 'react';

type AcceptFriendRequestApiResponse = TApiResponse & {
  data: TFriend;
};

const useAcceptFriendRequest = () => {
  const { updateFeed } = useFeedContext();
  const { addToFriends } = useAuthContext();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');

  const acceptFriendRequest = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!userId) {
      setStatus(STATUS.ERROR);
      setError('User ID is required');
      return;
    }

    try {
      const { success, error, data } =
        await api.patch<AcceptFriendRequestApiResponse>(
          `/friends/accept-request/${userId}`,
          {},
        );

      if (success) {
        setStatus(STATUS.SUCCESS);
        addToFriends(data);
        await updateFeed();
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

  return {
    acceptFriendRequest,
    status,
    error,
  };
};

export default useAcceptFriendRequest;
