import {
  AuthContext,
  TFriend,
  TFriendRequest,
} from '@/components/services/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useContext, useEffect, useState } from 'react';

type FoundUser = {
  _id: string;
  username: string;
};

type ApiResponse = {
  success: boolean;
  data: FoundUser[];
  error: string;
};

const useUserSearch = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [results, setResults] = useState<FoundUser[]>([]);
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState<TFriend[]>([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState<
    TFriendRequest[]
  >([]);

  useEffect(
    function getFriendsAndRequests() {
      if (user) {
        setFriends(user.friends);
        setIncomingFriendRequests(user.friendRequestsReceived);
      }
    },
    [user],
  );

  const search = async ({ searchTerm }: { searchTerm: string }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!searchTerm) {
      setStatus(STATUS.ERROR);
      setError('Search term is required');
      return;
    }

    try {
      const { success, data, error } = await api.get<ApiResponse>(
        `/users/search/${searchTerm}`,
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        setResults(data);
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

  return { status, error, search, results, friends, incomingFriendRequests };
};

export default useUserSearch;
