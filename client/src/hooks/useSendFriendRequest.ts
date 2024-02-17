import useUpdateUserData from '@/hooks/useUpdateUserData';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse } from '@/utils/types';
import { useState } from 'react';

const useSendFriendRequest = () => {
  const { updateUserData } = useUpdateUserData();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');

  const sendFriendRequest = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!userId) {
      setStatus(STATUS.ERROR);
      setError('User ID is required');
      return;
    }

    try {
      const { success, error } = await api.post<TApiResponse>(
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

  return {
    status,
    error,
    sendFriendRequest,
  };
};

export default useSendFriendRequest;
