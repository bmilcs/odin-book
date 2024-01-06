import { FeedContext } from '@/components/services/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useContext, useState } from 'react';

type ApiResponse = {
  success: boolean;
  error: string;
};

const useExistingComment = ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const { updateFeed } = useContext(FeedContext);

  const deleteComment = async () => {
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
        await updateFeed();
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

  const updateComment = async ({ content }: { content: string }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!postId) {
      setStatus(STATUS.ERROR);
      setError('Post ID is required');
      return;
    }

    if (!content) {
      setStatus(STATUS.ERROR);
      setError('Comment content is required');
      return;
    }

    try {
      const { success, error } = await api.patch<ApiResponse>(
        `/posts/${postId}/comments/${commentId}`,
        {
          content,
        },
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        await updateFeed();
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
    deleteComment,
    updateComment,
    status,
    error,
  };
};

export default useExistingComment;
