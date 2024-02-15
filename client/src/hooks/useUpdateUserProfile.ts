import { TUser } from '@/context/auth-provider';
import { useAuthContext } from '@/hooks/useAuthContext';
import api, { ApiResponse } from '@/utils/api';
import STATUS from '@/utils/constants';
import { ExpressValidatorError, getErrorMsg } from '@/utils/errors';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FetchUserProfileApiResponse = ApiResponse & {
  data: TUser;
};

type UpdateProfileApiResponse = FetchUserProfileApiResponse & {
  error: ExpressValidatorError[];
};

const useUpdateUserProfile = () => {
  const { user, updateUserData } = useAuthContext();
  const navigate = useNavigate();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    ExpressValidatorError[]
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
