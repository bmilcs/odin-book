import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TFriendRequest } from '@/utils/types';
import { useCallback, useState } from 'react';

type FetchAllUsersApiResponse = TApiResponse & {
  data: TFriendRequest[];
};

const useFetchAllUsers = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState<TFriendRequest[] | null>(null);

  const fetchAllUsers = useCallback(async () => {
    setStatus(STATUS.LOADING);
    setError('');

    try {
      const { success, error, data } =
        await api.get<FetchAllUsersApiResponse>(`/users`);
      if (success) {
        setStatus(STATUS.SUCCESS);
        setAllUsers(data);
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
  }, []);

  const reset = useCallback(() => {
    setStatus(STATUS.IDLE);
    setError('');
    setAllUsers(null);
  }, []);

  return {
    fetchAllUsers,
    reset,
    allUsers,
    status,
    error,
  };
};

export default useFetchAllUsers;
