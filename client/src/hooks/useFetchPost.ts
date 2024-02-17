import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TPost } from '@/utils/types';
import { useCallback, useState } from 'react';

type FetchPostApiResponse = TApiResponse & {
  data: TPost;
};

const useFetchPost = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [postData, setPostData] = useState<TPost | null>(null);

  const fetchPost = useCallback(async ({ postId }: { postId: string }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!postId) {
      setStatus(STATUS.ERROR);
      setError('Post ID is required');
      return;
    }

    try {
      const { success, error, data } = await api.get<FetchPostApiResponse>(
        `/posts/${postId}`,
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
  }, []);

  const reset = () => {
    setStatus(STATUS.IDLE);
    setError('');
    setPostData(null);
  };

  return {
    fetchPost,
    reset,
    postData,
    status,
    error,
  };
};

export default useFetchPost;
