import { useFeedContext } from '@/hooks/useFeedContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TLike } from '@/utils/types';
import { useState } from 'react';

type ToggleLikeApiResponse = TApiResponse & {
  data: {
    likeCount: number;
    isLikedByUser: boolean;
    likeDetails: TLike | null;
  };
};

type useToggleLikeProps = {
  contentType: 'comment' | 'post';
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
  const { togglePostLikeInFeed, toggleCommentLikeInFeed } = useFeedContext();

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

        if (contentType === 'post') {
          togglePostLikeInFeed(postId, data.likeDetails);
          return;
        }

        toggleCommentLikeInFeed(postId, commentId!, data.likeDetails);
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
