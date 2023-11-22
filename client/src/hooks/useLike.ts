import { AuthContext, TUser } from '@/components/services/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ApiResponse = {
  success: boolean;
  data: TUser;
  error: string;
};

const useLike = ({
  contentType,
  _id,
  isLiked,
}: {
  contentType: 'post' | 'comment';
  _id: string;
  isLiked: boolean;
}) => {
  const { setUser } = useContext(AuthContext);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [likeStatus, setLikeStatus] = useState(isLiked);

  const toggleLike = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setStatus(STATUS.LOADING);
    setError('');

    try {
      const { success, data, error } = await api.post<ApiResponse>(
        '/auth/login',
        {
          email,
          password,
        },
      );

      if (!success) {
        console.log(error);
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }

      // successful login: redirect to feed
      setUser(data);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  };

  return { status, error, toggleLike, likeStatus };
};

export default useLike;
