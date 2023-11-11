import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { ExpressValidatorError } from '@/utils/errors';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ApiResponse = {
  success: boolean;
  error: ExpressValidatorError[];
};

const useSignup = () => {
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
      const { success, error } = await api.post<ApiResponse>('/auth/signup', {
        email,
        username,
        password,
        confirmPassword,
      });

      if (!success) {
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }

      // successful signup: redirect to feed
      navigate('/feed');
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  };

  return { status, error, signup };
};

export default useSignup;
