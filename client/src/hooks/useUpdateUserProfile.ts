import { useAuthContext } from '@/hooks/useAuthContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import {
  TActiveUserProfileDetails,
  TApiResponse,
  TExpressValidatorError,
} from '@/utils/types';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UpdateProfileApiResponse = TApiResponse & {
  error: TExpressValidatorError[];
  data: TActiveUserProfileDetails;
};

const useUpdateUserProfile = () => {
  const { user, setUserProfileDetails } = useAuthContext();
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
    async (userProfile: UpdateUserProfileProps) => {
      setStatus(STATUS.LOADING);
      setError('');
      setValidationErrors([]);

      const currentUsername = user?.username;

      try {
        const { success, error, data } =
          await api.patch<UpdateProfileApiResponse>(
            `/users/${currentUsername}`,
            userProfile,
          );
        if (success) {
          setStatus(STATUS.SUCCESS);
          setUserProfileDetails(data);
          navigate(`/users/${data.username}`);
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
    [user?.username, navigate, setUserProfileDetails],
  );

  return {
    status,
    error,
    validationErrors,
    updateUserProfile,
  };
};

export default useUpdateUserProfile;
