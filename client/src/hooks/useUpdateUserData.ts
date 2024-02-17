import { AuthContext } from '@/context/auth-provider';
import api from '@/utils/api';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TUser } from '@/utils/types';
import { useCallback, useContext, useState } from 'react';

type UpdateUserDataApiResponse = TApiResponse & {
  data: TUser;
};

const useUpdateUserData = () => {
  const { setUser } = useContext(AuthContext);
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
    } catch (error) {
      setUser(null);
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
