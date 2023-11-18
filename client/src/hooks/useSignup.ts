import { AuthContext, TUser } from '@/components/services/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { ExpressValidatorError } from '@/utils/errors';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ApiResponse = {
  success: boolean;
  error: ExpressValidatorError[];
  data: TUser;
};

const useSignup = () => {
  const { setUser } = useContext(AuthContext);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState<ExpressValidatorError[]>([]);
  const navigate = useNavigate();

  const signup = async ({
    email,
    username,
    password,
    confirmPassword,
  }: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    setStatus(STATUS.LOADING);
    setError([]);

    try {
      const { success, data, error } = await api.post<ApiResponse>(
        '/auth/signup',
        {
          email,
          username,
          password,
          confirmPassword,
        },
      );

      if (!success) {
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }

      // successful signup: redirect to feed
      setUser(data);
      navigate('/feed');
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  };

  return { status, error, signup };
};

export default useSignup;
