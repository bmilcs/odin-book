import { FeedContext } from '@/components/services/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
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
      setError(error);
      setStatus(STATUS.ERROR);
    } catch (error) {
      console.log(error);
    }
  };

  return { submitComment, status, error };
};

export default useNewComment;
