import { FeedContext, TPost } from '@/components/services/feed-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { useContext, useState } from 'react';

type ApiResponse = {
  success: boolean;
  error: string;
};

type GetPostApiResponse = {
  success: boolean;
  data: TPost;
  error: string;
};

const usePost = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [postData, setPostData] = useState<TPost | null>(null);
  const { updateFeed } = useContext(FeedContext);

  const getPost = async ({ postId }: { postId: string }) => {
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
  };

  const createPost = async ({
    content,
    onSuccess = updateFeed,
  }: {
    content: string;
    onSuccess?: () => void;
  }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!content) {
      setStatus(STATUS.ERROR);
      setError('Post content is required');
      return;
    }

    try {
      const { success, error } = await api.post<ApiResponse>('/posts', {
        content,
      });
      if (success) {
        setStatus(STATUS.SUCCESS);
        onSuccess();
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

  const deletePost = async ({
    postId,
    onSuccess = updateFeed,
  }: {
    postId: string;
    onSuccess?: () => void;
  }) => {
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
        onSuccess();
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
    onSuccess = updateFeed,
  }: {
    postId: string;
    content: string;
    onSuccess?: () => void;
  }) => {
    setStatus(STATUS.LOADING);
    setError('');

    if (!postId) {
      setStatus(STATUS.ERROR);
      setError('Post ID is required');
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
        onSuccess();
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
    createPost,
    deletePost,
    updatePost,
    getPost,
    postData,
    status,
    error,
  };
};

export default usePost;
