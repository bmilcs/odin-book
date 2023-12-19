import api from '@/utils/api';
import STATUS from '@/utils/constants';
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
    try {
      const { success, data, error } = await api.get<ApiResponse>(
        `/users/search/${searchTerm}`,
      );
      if (!success) {
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }
      setResults(data);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  };

  return { status, error, search, results };
};

export default useUserSearch;
