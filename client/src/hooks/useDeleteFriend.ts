import { useAuthContext } from '@/hooks/useAuthContext';
import { useFeedContext } from '@/hooks/useFeedContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse } from '@/utils/types';
import { useState } from 'react';

const useDeleteFriend = () => {
  const { updateFeed } = useFeedContext();
  const { removeFromFriends } = useAuthContext();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');

  const deleteFriend = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!userId) {
      setStatus(STATUS.ERROR);
      setError('User ID is required');
      return;
    }

    try {
      const { success, error } = await api.del<TApiResponse>(
        `/friends/${userId}`,
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        removeFromFriends(userId);
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
    status,
    error,
    deleteFriend,
  };
};

export default useDeleteFriend;
