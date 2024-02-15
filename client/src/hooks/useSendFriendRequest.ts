import { AuthContext } from '@/context/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useContext, useState } from 'react';

type ApiResponse = {
  success: boolean;
  message: string;
  error: string;
};

const useSendFriendRequest = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const { updateUserData } = useContext(AuthContext);

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

  return {
    status,
    error,
    sendFriendRequest,
  };
};

export default useSendFriendRequest;
