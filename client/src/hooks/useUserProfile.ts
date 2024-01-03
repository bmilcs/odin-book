import { TUser } from '@/components/services/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
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
    try {
      const { success, data, error } = await api.get<ApiResponse>(
        `/users/${username}`,
      );
      if (!success) {
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }
      setUserProfile(data);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  }, []);

  return { status, error, getUserProfile, userProfile };
};

export default useUserProfile;
