import { TComment } from '@/context/feed-provider';
import api, { ApiResponse } from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useState } from 'react';

type CreateCommentApiResponse = ApiResponse & {
  data: TComment;
};

const useCreateComment = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [commentData, setCommentData] = useState<TComment | null>(null);

  const createComment = async ({
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

    if (!content) {
      setStatus(STATUS.ERROR);
      setError('Comment content is required');
      return;
    }

    try {
      const { success, error, data } = await api.post<CreateCommentApiResponse>(
        `/posts/${postId}/comments`,
        {
          content,
        },
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
        setCommentData(data);
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
    setCommentData(null);
  };

  return {
    createComment,
    reset,
    commentData,
    status,
    error,
  };
};

export default useCreateComment;
