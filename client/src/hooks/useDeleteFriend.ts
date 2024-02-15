import { AuthContext } from '@/context/auth-provider';
import { FeedContext } from '@/context/feed-provider';
import api, { ApiResponse } from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useContext, useState } from 'react';

const useDeleteFriend = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const { updateFeed } = useContext(FeedContext);
  const { updateUserData } = useContext(AuthContext);

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

  return {
    status,
    error,
    deleteFriend,
  };
};

export default useDeleteFriend;
