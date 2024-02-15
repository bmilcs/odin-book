import { TComment } from '@/context/feed-provider';
import api, { ApiResponse } from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useState } from 'react';

const useDeleteComment = () => {
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
      const { success, error } = await api.del<ApiResponse>(
        `/posts/${postId}/comments/${commentId}`,
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
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
