import { useAuthContext } from '@/hooks/useAuthContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse } from '@/utils/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UpdateProfileImageApiResponse = TApiResponse & {
  data: string;
};

const useProfileImageUpload = () => {
  const { user, setUserProfileImage } = useAuthContext();
  const navigate = useNavigate();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');

  const updateProfileImage = async (formData: FormData) => {
    setStatus(STATUS.LOADING);
    setError('');

    try {
      const { success, data, error } =
        await api.put<UpdateProfileImageApiResponse>(
          `/users/${user!.username}/upload-profile-image/`,
          formData,
        );
      if (success) {
        setStatus(STATUS.SUCCESS);
        setUserProfileImage(data);
        navigate('/feed');
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
