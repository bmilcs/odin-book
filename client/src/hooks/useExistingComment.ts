import { FeedContext } from '@/components/services/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
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
    if (!postId) {
      setError('Post ID not found');
      setStatus(STATUS.ERROR);
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
      setError(error);
      setStatus(STATUS.ERROR);
    } catch (error) {
      console.log(error);
    }
  };

  const updateComment = async ({ content }: { content: string }) => {
    if (!postId) {
      setError('Post ID not found');
      setStatus(STATUS.ERROR);
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
      setError(error);
      setStatus(STATUS.ERROR);
    } catch (error) {
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
