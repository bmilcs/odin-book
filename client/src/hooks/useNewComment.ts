import { FeedContext } from '@/components/services/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useContext, useState } from 'react';

type ApiResponse = {
  success: boolean;
  error: string;
};

const useNewComment = ({ postId }: { postId: string }) => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const { updateFeed } = useContext(FeedContext);

  const submitComment = async ({ content }: { content: string }) => {
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
      const { success, error } = await api.post<ApiResponse>(
        `/posts/${postId}/comments`,
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

  return { submitComment, status, error };
};

export default useNewComment;
