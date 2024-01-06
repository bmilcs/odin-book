import { FeedContext } from '@/components/services/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useContext, useState } from 'react';

type ApiResponse = {
  success: boolean;
  error: string;
};

const useNewPost = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const { updateFeed } = useContext(FeedContext);

  const submitPost = async ({ content }: { content: string }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!content) {
      setStatus(STATUS.ERROR);
      setError('Post content is required');
      return;
    }

    try {
      const { success, error } = await api.post<ApiResponse>('/posts', {
        content,
      });
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

  return { submitPost, status, error };
};

export default useNewPost;
