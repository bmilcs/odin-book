import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TPost } from '@/utils/types';
import { useState } from 'react';

type UpdatePostApiResponse = TApiResponse & {
  data: TPost;
};

const useUpdatePost = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [postData, setPostData] = useState<TPost | null>(null);

  const updatePost = async ({
    postId,
    content,
  }: {
    postId: string;
    content: string;
  }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!postId) {
      setStatus(STATUS.ERROR);
      setError('Post ID is required');
      return;
    }

    try {
      const { data, success, error } = await api.patch<UpdatePostApiResponse>(
        `/posts/${postId}`,
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

  return {
    updatePost,
    postData,
    status,
    error,
  };
};

export default useUpdatePost;
