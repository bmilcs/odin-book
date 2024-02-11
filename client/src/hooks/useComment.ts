import { TComment } from '@/context/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useState } from 'react';

type ApiResponse = {
  success: boolean;
  error: string;
};

type CreateCommentApiResponse = ApiResponse & {
  data: TComment;
};

type UpdateCommentApiResponse = ApiResponse & {
  data: TComment;
};

const useComment = () => {
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

  const deleteComment = async ({
    postId,
    commentId,
  }: {
    postId: string;
    commentId: string;
  }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!postId) {
      setStatus(STATUS.ERROR);
      setError('Post ID is required');
      return;
    }

    try {
      const { success, error } = await api.del<ApiResponse>(
        `/posts/${postId}/comments/${commentId}`,
      );
      if (success) {
        setStatus(STATUS.SUCCESS);
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
    createComment,
    updateComment,
    deleteComment,
    reset,
    commentData,
    status,
    error,
  };
};

export default useComment;
