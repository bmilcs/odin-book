import { TPost } from '@/context/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useCallback, useState } from 'react';

type ApiResponse = {
  success: boolean;
  error: string;
};

type GetPostApiResponse = {
  success: boolean;
  data: TPost;
  error: string;
};

type CreatePostApiResponse = {
  success: boolean;
  data: TPost;
  error: string;
};

type UpdatePostApiResponse = GetPostApiResponse;

const usePost = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [postData, setPostData] = useState<TPost | null>(null);

  const getPost = useCallback(async ({ postId }: { postId: string }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!postId) {
      setStatus(STATUS.ERROR);
      setError('Post ID is required');
      return;
    }

    try {
      const { success, error, data } = await api.get<GetPostApiResponse>(
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

  const deletePost = async ({ postId }: { postId: string }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!postId) {
      setStatus(STATUS.ERROR);
      setError('Post ID is required');
      return;
    }

    try {
      const { success, error } = await api.del<ApiResponse>(`/posts/${postId}`);
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

  const reset = () => {
    setStatus(STATUS.IDLE);
    setError('');
    setPostData(null);
  };

  return {
    createPost,
    deletePost,
    updatePost,
    getPost,
    reset,
    postData,
    status,
    error,
  };
};

export default usePost;
