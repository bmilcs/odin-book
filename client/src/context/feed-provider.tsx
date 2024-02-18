import { useAuthContext } from '@/hooks/useAuthContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TComment, TLike, TPost } from '@/utils/types';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

type UpdateFeedApiResponse = TApiResponse & {
  data: TPost[];
};

type FeedContextProps = {
  status: string;
  error: string;
  feed: TPost[];
  updateFeed: () => Promise<void>;
  addPostToFeed: (post: TPost) => void;
  removePostFromFeed: (postId: string) => void;
  addCommentToFeed: (postId: string, comment: TComment) => void;
  removeCommentFromFeed: (postId: string, commentId: string) => void;
  togglePostLikeInFeed: (postId: string, likeDetails: TLike | null) => void;
  toggleCommentLikeInFeed: (
    postId: string,
    commentId: string,
    likeDetails: TLike | null,
  ) => void;
};

export const FeedContext = createContext<FeedContextProps>({
  status: STATUS.IDLE,
  error: '',
  feed: [],
  updateFeed: async () => {},
  addPostToFeed: () => {},
  removePostFromFeed: () => {},
  addCommentToFeed: () => {},
  removeCommentFromFeed: () => {},
  togglePostLikeInFeed: () => {},
  toggleCommentLikeInFeed: () => {},
});

type FeedProviderProps = {
  children: ReactNode;
};

const FeedProvider: FC<FeedProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthContext();

  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [feed, setFeed] = useState<TPost[]>([]);

  const addPostToFeed = (post: TPost) => {
    setFeed((prev) => [post, ...prev]);
  };

  const removePostFromFeed = (postId: string) => {
    setFeed((prev) => prev.filter((post) => post._id !== postId));
  };

  const addCommentToFeed = (postId: string, comment: TComment) => {
    setFeed((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [comment, ...post.comments],
          };
        }
        return post;
      }),
    );
  };

  const removeCommentFromFeed = (postId: string, commentId: string) => {
    setFeed((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.filter(
              (comment) => comment._id !== commentId,
            ),
          };
        }
        return post;
      }),
    );
  };

  const togglePostLikeInFeed = (postId: string, likeDetails: TLike | null) => {
    const isDeleted = likeDetails === null;
    // Remove like from the post
    if (isDeleted) {
      setFeed((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: post.likes.filter((like) => like.user._id !== user!._id),
            };
          }
          return post;
        }),
      );
      return;
    }
    // Add like to the post
    setFeed((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          console.log('found post, adding like', post.likes, { likeDetails });
          return {
            ...post,
            likes: [likeDetails, ...post.likes],
          };
        }
        return post;
      }),
    );
  };

  const toggleCommentLikeInFeed = (
    postId: string,
    commentId: string,
    likeDetails: TLike | null,
  ) => {
    const isDeleted = likeDetails === null;
    // Remove like from the comment
    if (isDeleted) {
      setFeed((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.map((comment) => {
                if (comment._id === commentId) {
                  return {
                    ...comment,
                    likes: comment.likes.filter(
                      (like) => like.user._id !== user!._id,
                    ),
                  };
                }
                return comment;
              }),
            };
          }
          return post;
        }),
      );
      return;
    }
    // Add like to the comment
    setFeed((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  likes: [likeDetails, ...comment.likes],
                };
              }
              return comment;
            }),
          };
        }
        return post;
      }),
    );
  };

  const updateFeed = useCallback(async () => {
    setStatus(STATUS.LOADING);
    setFeed([]);

    try {
      const { success, error, data } =
        await api.get<UpdateFeedApiResponse>('/feed');
      if (success) {
        setStatus(STATUS.SUCCESS);
        setFeed(data);
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

  useEffect(() => {
    if (isAuthenticated()) {
      updateFeed();
    }
  }, [isAuthenticated, updateFeed, user]);

  return (
    <FeedContext.Provider
      value={{
        status,
        error,
        feed,
        updateFeed,
        addPostToFeed,
        removePostFromFeed,
        addCommentToFeed,
        removeCommentFromFeed,
        togglePostLikeInFeed,
        toggleCommentLikeInFeed,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export default FeedProvider;
