import { useAuthContext } from '@/hooks/useAuthContext';
import useUpdateUserData from '@/hooks/useUpdateUserData';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TExpressValidatorError } from '@/utils/types';
import { TApiResponse, TUser } from '@/utils/types.ts';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FetchUserProfileApiResponse = TApiResponse & {
  data: TUser;
};

type UpdateProfileApiResponse = FetchUserProfileApiResponse & {
  error: TExpressValidatorError[];
};

const useUpdateUserProfile = () => {
  const { updateUserData } = useUpdateUserData();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    TExpressValidatorError[]
  >([]);

  type UpdateUserProfileProps = {
    username: string;
    email: string;
    location: string;
    bio: string;
  };

  const updateUserProfile = useCallback(
    async ({ username, email, location, bio }: UpdateUserProfileProps) => {
      setStatus(STATUS.LOADING);
      setError('');
      setValidationErrors([]);

      if (!username) {
        setStatus(STATUS.ERROR);
        setError('Username is required');
        return;
      }

      const currentUsername = user?.username;

      try {
        const { success, error } = await api.patch<UpdateProfileApiResponse>(
          `/users/${currentUsername}`,
          {
            username,
            email,
            location,
            bio,
          },
        );
        if (success) {
          setStatus(STATUS.SUCCESS);
          await updateUserData();
          navigate(`/users/${username}`);
          return;
        }
        setStatus(STATUS.ERROR);
        setValidationErrors(error);
      } catch (error) {
        setStatus(STATUS.ERROR);
        const errorMsg = getErrorMsg(error);
        setError(errorMsg);
        console.log(error);
      }
    },
    [updateUserData, user?.username, navigate],
  );

  return {
    status,
    error,
    validationErrors,
    updateUserProfile,
  };
};

export default useUpdateUserProfile;
