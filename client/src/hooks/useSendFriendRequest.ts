import { useAuthContext } from '@/hooks/useAuthContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TFriendRequest } from '@/utils/types';
import { useState } from 'react';

type SendFriendRequestApiResponse = TApiResponse & {
  data: TFriendRequest;
};

const useSendFriendRequest = () => {
  const { addToSentFriendRequests } = useAuthContext();

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
      const { success, error, data } =
        await api.post<SendFriendRequestApiResponse>(
          `/friends/send-request/${userId}`,
          {},
        );

      if (success) {
        setStatus(STATUS.SUCCESS);
        addToSentFriendRequests(data);
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
