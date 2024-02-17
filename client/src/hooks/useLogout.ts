import { useAuthContext } from '@/hooks/useAuthContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse } from '@/utils/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');

  const logout = async () => {
    setStatus(STATUS.LOADING);
    setError('');

    try {
      const { success } = await api.post<TApiResponse>('/auth/logout', {});
      if (success) {
        setStatus(STATUS.SUCCESS);
        setUser(null);
        navigate('/login');
        return;
      }

      setStatus(STATUS.ERROR);
      console.log('Unable to logout at this time');
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(errorMsg);
    }
  };

  return { status, error, logout };
};

export default useLogout;
