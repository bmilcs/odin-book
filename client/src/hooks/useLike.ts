import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
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
  postId: string;
  commentId?: string;
  isLiked: boolean;
  likeCount: number;
};

const useLike = ({
  contentType,
  postId,
  commentId,
  isLiked,
  likeCount,
}: useLikeProps) => {
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
        ? `/posts/${postId}/like`
        : `/posts/${postId}/comments/${commentId}/like`;

    try {
      const { success, data, error } =
        action === 'post'
          ? await api.post<ApiResponse>(apiUrl, {})
          : await api.del<ApiResponse>(apiUrl);
      if (success) {
        setStatus(STATUS.SUCCESS);
        setTotalLikes(data.likeCount);
        setLikeStatus(data.isLikedByUser);
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

  return { status, error, toggleLike, likeStatus, totalLikes };
};

export default useLike;
