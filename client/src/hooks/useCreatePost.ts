import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TPost } from '@/utils/types';
import { useState } from 'react';

type CreatePostApiResponse = TApiResponse & {
  data: TPost;
};

const useCreatePost = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [postData, setPostData] = useState<TPost | null>(null);

  const createPost = async ({ content }: { content: string }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!content) {
      setStatus(STATUS.ERROR);
      setError('Post content is required');
      return;
    }

    try {
      const { success, error, data } = await api.post<CreatePostApiResponse>(
        '/posts',
        {
          content,
        },
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        setPostData(data);
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
    setPostData(null);
  };

  return {
    createPost,
    reset,
    postData,
    status,
    error,
  };
};

export default useCreatePost;
