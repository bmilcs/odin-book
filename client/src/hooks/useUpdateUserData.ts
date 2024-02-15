import { TUser } from '@/context/auth-provider';
import { useAuthContext } from '@/hooks/useAuthContext';
import api, { ApiResponse } from '@/utils/api';
import { getErrorMsg } from '@/utils/errors';
import { useCallback, useState } from 'react';

type UpdateUserDataApiResponse = ApiResponse & {
  data: TUser;
};

const useUpdateUserData = () => {
  const { setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  const updateUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { success, data } =
        await api.get<UpdateUserDataApiResponse>('/auth/status');
      if (success) {
        setUser(data);
        return;
      }
      setUser(null);
      console.log('Unable to update user data at this time');
    } catch (error) {
      const errorMsg = getErrorMsg(error);
      console.log(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  return {
    updateUserData,
    isLoading,
  };
};

export default useUpdateUserData;
