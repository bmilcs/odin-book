import { TUser } from '@/components/services/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useCallback, useState } from 'react';

type ApiResponse = {
  success: boolean;
  data: TUser;
  error: string;
};

const useUserProfile = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<TUser | null>(null);

  const getUserProfile = useCallback(async (username: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!username) {
      setStatus(STATUS.ERROR);
      setError('Username is required');
      return;
    }

    try {
      const { success, data, error } = await api.get<ApiResponse>(
        `/users/${username}`,
      );
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

  return { status, error, getUserProfile, userProfile };
};

export default useUserProfile;
