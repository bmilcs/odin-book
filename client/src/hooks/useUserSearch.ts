import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useState } from 'react';

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

  return { status, error, search, results };
};

export default useUserSearch;
