import useUserRelationships from '@/hooks/useUserRelationships';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TUser } from '@/utils/types';
import { useCallback, useState } from 'react';

type FetchUserProfileApiResponse = TApiResponse & {
  data: TUser;
};

const useFetchUserProfile = () => {
  const {
    isUserAFriend,
    isUserInIncomingFriendRequests,
    isUserInOutgoingFriendRequests,
    isUserTheActiveUser,
  } = useUserRelationships();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<TUser | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isInOutgoingFriendRequests, setIsInOutgoingFriendRequests] =
    useState(false);
  const [isInIncomingFriendRequests, setIsInIncomingFriendRequests] =
    useState(false);
  const [isProfileOwner, setIsProfileOwner] = useState(false);

  const fetchUserProfile = useCallback(
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
          await api.get<FetchUserProfileApiResponse>(`/users/${username}`);
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

  return {
    status,
    error,
    fetchUserProfile,
    isFriend,
    isInOutgoingFriendRequests,
    isInIncomingFriendRequests,
    isProfileOwner,
    userProfile,
  };
};

export default useFetchUserProfile;
