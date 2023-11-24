import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { useState } from 'react';

type ApiResponse = {
  success: boolean;
  message: string;
  error: string;
  data: {
    likeCount: number;
    isLikedByUser: boolean;
  };
};

type useLikeProps = {
  contentType: 'post' | 'comment';
  _id: string;
  isLiked: boolean;
  likeCount: number;
};

const useLike = ({ contentType, _id, isLiked, likeCount }: useLikeProps) => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [likeStatus, setLikeStatus] = useState(isLiked);
  const [totalLikes, setTotalLikes] = useState(likeCount);

  const toggleLike = async () => {
    setStatus(STATUS.LOADING);
    setError('');

    const action = likeStatus ? 'delete' : 'post';
    const apiUrl =
      contentType === 'post'
        ? `/posts/${_id}/like`
        : `/posts/${_id}/comments/${_id}/like`;

    try {
      const { success, data, error } =
        action === 'post'
          ? await api.post<ApiResponse>(apiUrl, {})
          : await api.del<ApiResponse>(apiUrl);
      if (!success) {
        console.log(error);
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }
      setTotalLikes(data.likeCount);
      setLikeStatus(data.isLikedByUser);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  };

  return { status, error, toggleLike, likeStatus, totalLikes };
};

export default useLike;
