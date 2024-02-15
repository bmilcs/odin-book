import { TUser } from '@/context/auth-provider';
import { useAuthContext } from '@/hooks/useAuthContext';
import api, { ApiResponse } from '@/utils/api';
import STATUS from '@/utils/constants';
import { ExpressValidatorError, getErrorMsg } from '@/utils/errors';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SignupApiResponse = ApiResponse & {
  error: ExpressValidatorError[];
  data: TUser;
};

const useSignup = () => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    ExpressValidatorError[]
  >([]);

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
    setError('');
    setValidationErrors([]);

    if (!email || !username || !password || !confirmPassword) {
      setStatus(STATUS.ERROR);
      setError('All fields are required');
      return;
    }

    try {
      const { success, data, error } = await api.post<SignupApiResponse>(
        '/auth/signup',
        {
          email,
          username,
          password,
          confirmPassword,
        },
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        setUser(data);
        navigate('/feed');
        return;
      }
      setStatus(STATUS.ERROR);
      setValidationErrors(error);
      setError('Please fix the errors above');
    } catch (error) {
      setStatus(STATUS.ERROR);
      const errorMsg = getErrorMsg(error);
      setError(errorMsg);
      console.log(error);
    }
  };

  return { status, error, validationErrors, signup };
};

export default useSignup;
