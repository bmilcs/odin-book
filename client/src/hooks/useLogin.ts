import { AuthContext, TUser } from '@/components/services/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ApiResponse = {
  success: boolean;
  data: TUser;
  error: string;
};

const useLogin = () => {
  const { setUser } = useContext(AuthContext);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!email || !password) {
      setStatus(STATUS.ERROR);
      setError('Email and password are required');
      return;
    }

    try {
      const { success, data, error } = await api.post<ApiResponse>(
        '/auth/login',
        {
          email,
          password,
        },
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        setUser(data);
        navigate('/feed');
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

  return { status, error, login };
};

export default useLogin;
