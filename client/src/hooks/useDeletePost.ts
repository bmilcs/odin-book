import { useFeedContext } from '@/hooks/useFeedContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse } from '@/utils/types';
import { useState } from 'react';

const useDeletePost = () => {
  const { removePostFromFeed } = useFeedContext();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');

  const deletePost = async ({ postId }: { postId: string }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!postId) {
      setStatus(STATUS.ERROR);
      setError('Post ID is required');
      return;
    }

    try {
      const { success, error } = await api.del<TApiResponse>(
        `/posts/${postId}`,
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        removePostFromFeed(postId);
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

  return {
    deletePost,
    status,
    error,
  };
};

export default useDeletePost;
