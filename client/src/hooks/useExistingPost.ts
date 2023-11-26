import { FeedContext } from '@/components/services/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { useContext, useState } from 'react';

type ApiResponse = {
  success: boolean;
  error: string;
};

const useExistingPost = ({ postId }: { postId: string }) => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const { updateFeed } = useContext(FeedContext);

  const deletePost = async () => {
    if (!postId) {
      setError('Post ID not found');
      setStatus(STATUS.ERROR);
      return;
    }
    try {
      const { success, error } = await api.del<ApiResponse>(`/posts/${postId}`);
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

  const updatePost = async ({ content }: { content: string }) => {
    if (!postId) {
      setError('Post ID not found');
      setStatus(STATUS.ERROR);
      return;
    }

    try {
      const { success, error } = await api.patch<ApiResponse>(
        `/posts/${postId}`,
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

  return { deletePost, updatePost, status, error };
};

export default useExistingPost;
