import { TComment } from '@/context/feed-provider';
import api, { ApiResponse } from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useState } from 'react';

type UpdateCommentApiResponse = ApiResponse & {
  data: TComment;
};

const useUpdateComment = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [commentData, setCommentData] = useState<TComment | null>(null);

  const updateComment = async ({
    postId,
    commentId,
    content,
  }: {
    postId: string;
    commentId: string;
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
      const { data, success, error } =
        await api.patch<UpdateCommentApiResponse>(
          `/posts/${postId}/comments/${commentId}`,
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
    updateComment,
    reset,
    commentData,
    status,
    error,
  };
};

export default useUpdateComment;
