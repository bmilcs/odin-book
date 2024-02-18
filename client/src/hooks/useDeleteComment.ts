import { useFeedContext } from '@/hooks/useFeedContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TComment } from '@/utils/types';
import { useState } from 'react';

const useDeleteComment = () => {
  const { removeCommentFromFeed } = useFeedContext();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [commentData, setCommentData] = useState<TComment | null>(null);

  const deleteComment = async ({
    postId,
    commentId,
  }: {
    postId: string;
    commentId: string;
  }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!postId) {
      setStatus(STATUS.ERROR);
      setError('Post ID is required');
      return;
    }

    try {
      const { success, error } = await api.del<TApiResponse>(
        `/posts/${postId}/comments/${commentId}`,
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        setCommentData(null);
        removeCommentFromFeed(postId, commentId);
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

  const reset = () => {
    setStatus(STATUS.IDLE);
    setError('');
    setCommentData(null);
  };

  return {
    deleteComment,
    reset,
    commentData,
    status,
    error,
  };
};

export default useDeleteComment;
