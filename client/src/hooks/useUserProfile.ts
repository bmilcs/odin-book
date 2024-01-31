import { AuthContext, TUser } from '@/components/services/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { ExpressValidatorError, getErrorMsg } from '@/utils/errors';
import { useCallback, useContext, useState } from 'react';

type GetUserProfileApiResponse = {
  success: boolean;
  data: TUser;
  error: string;
};

type UpdateProfileApiResponse = GetUserProfileApiResponse & {
  error: ExpressValidatorError[];
};

const useUserProfile = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    ExpressValidatorError[]
  >([]);
  const [userProfile, setUserProfile] = useState<TUser | null>(null);
  const { user, updateUserData } = useContext(AuthContext);

  const getUserProfile = useCallback(async (username: string) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!username) {
      setStatus(STATUS.ERROR);
      setError('Username is required');
      return;
    }

    try {
      const { success, data, error } = await api.get<GetUserProfileApiResponse>(
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
        const { success, data, error } =
          await api.patch<UpdateProfileApiResponse>(
            `/users/${currentUsername}`,
            {
              username,
              email,
              location,
              bio,
            },
          );
        console.log({ success, data, error });
        if (success) {
          setStatus(STATUS.SUCCESS);
          setUserProfile(data);
          updateUserData();
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
    [updateUserData, user?.username],
  );

  return {
    status,
    error,
    validationErrors,
    getUserProfile,
    updateUserProfile,
    userProfile,
  };
};

export default useUserProfile;
