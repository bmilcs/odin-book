import api, { ApiResponse } from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useState } from 'react';

type ToggleLikeApiResponse = ApiResponse & {
  data: {
    likeCount: number;
    isLikedByUser: boolean;
  };
};

type useToggleLikeProps = {
  contentType: 'post' | 'comment';
  postId: string;
  commentId?: string;
  isLiked: boolean;
  likeCount: number;
};

const useLikeToggle = ({
  contentType,
  postId,
  commentId,
  isLiked,
  likeCount,
}: useToggleLikeProps) => {
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
          ? await api.post<ToggleLikeApiResponse>(apiUrl, {})
          : await api.del<ToggleLikeApiResponse>(apiUrl);
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

export default useLikeToggle;
