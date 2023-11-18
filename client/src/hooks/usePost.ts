import { FeedContext } from '@/components/services/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { useContext, useState } from 'react';

type ApiResponse = {
  success: boolean;
  error: string;
};

const usePost = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const { updateFeed } = useContext(FeedContext);

  const submitPost = async ({ content }: { content: string }) => {
    try {
      const { success, error } = await api.post<ApiResponse>('/posts', {
        content,
      });
      if (success) {
        console.log('usePost: post submitted');
        setStatus(STATUS.SUCCESS);
        await updateFeed();
        console.log('usePost: feed updated');
        return;
      }
      setError(error);
      setStatus(STATUS.ERROR);
    } catch (error) {
      console.log(error);
    }
  };

  return { submitPost, status, error };
};

export default usePost;
