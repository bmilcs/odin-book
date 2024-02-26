import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TUserProfile } from '@/utils/types';
import { useCallback, useState } from 'react';

type FetchUserProfileApiResponse = TApiResponse & {
  data: TUserProfile;
};

const useFetchUserProfile = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<TUserProfile | null>(null);

  const fetchUserProfile = useCallback(async (username: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!username) {
      setStatus(STATUS.ERROR);
      setError('Username is required');
      return;
    }

    try {
      const { success, data, error } =
        await api.get<FetchUserProfileApiResponse>(`/users/${username}`);
      if (success) {
        setStatus(STATUS.SUCCESS);
        setUserProfile(data);
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

  return {
    status,
    error,
    fetchUserProfile,
    userProfile,
  };
};

export default useFetchUserProfile;
