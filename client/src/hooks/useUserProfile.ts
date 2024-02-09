import { AuthContext, TUser } from '@/components/services/auth-provider';
import useFriends from '@/hooks/useFriends';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { ExpressValidatorError, getErrorMsg } from '@/utils/errors';
import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const { user, updateUserData } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState<TUser | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    ExpressValidatorError[]
  >([]);
  const {
    isUserAFriend,
    isUserInIncomingFriendRequests,
    isUserInOutgoingFriendRequests,
    isUserTheActiveUser,
  } = useFriends();
  const [isFriend, setIsFriend] = useState(false);
  const [isInOutgoingFriendRequests, setIsInOutgoingFriendRequests] =
    useState(false);
  const [isInIncomingFriendRequests, setIsInIncomingFriendRequests] =
    useState(false);
  const [isProfileOwner, setIsProfileOwner] = useState(false);
  const navigate = useNavigate();

  const getUserProfile = useCallback(
    async (username: string) => {
      setStatus(STATUS.LOADING);
      setIsFriend(false);
      setIsInOutgoingFriendRequests(false);
      setIsInIncomingFriendRequests(false);
      setIsProfileOwner(false);
      setError('');

      if (!username) {
        setStatus(STATUS.ERROR);
        setError('Username is required');
        return;
      }

      try {
        const { success, data, error } =
          await api.get<GetUserProfileApiResponse>(`/users/${username}`);
        if (success) {
          setStatus(STATUS.SUCCESS);
          setUserProfile(data);
          setIsProfileOwner(isUserTheActiveUser(data!.username));
          setIsFriend(isUserAFriend(data!.username));
          setIsInOutgoingFriendRequests(
            isUserInOutgoingFriendRequests(data!.username),
          );
          setIsInIncomingFriendRequests(
            isUserInIncomingFriendRequests(data!.username),
          );
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
    },
    [
      isUserAFriend,
      isUserInIncomingFriendRequests,
      isUserInOutgoingFriendRequests,
      isUserTheActiveUser,
    ],
  );

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
    getUserProfile,
    updateUserProfile,
    isFriend,
    isInOutgoingFriendRequests,
    isInIncomingFriendRequests,
    isProfileOwner,
    userProfile,
  };
};

export default useUserProfile;
