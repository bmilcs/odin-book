import { AuthContext } from '@/context/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useContext, useState } from 'react';

type ApiResponse = {
  success: boolean;
  error: string;
  data: string;
};

const useProfileImageUpload = () => {
  const { user, setUser } = useContext(AuthContext);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');

  const updateProfileImage = async (formData: FormData) => {
    setStatus(STATUS.LOADING);
    setError('');

    try {
      const { success, data, error } = await api.put<ApiResponse>(
        `/users/${user!.username}/upload-profile-image/`,
        formData,
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        setUser({ ...user!, photo: data });
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

  return { status, error, updateProfileImage };
};

export default useProfileImageUpload;
