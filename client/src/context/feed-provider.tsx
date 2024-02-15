import { AuthContext, TUser } from '@/context/auth-provider';
import api, { ApiResponse } from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type UpdateFeedApiResponse = ApiResponse & {
  data: TPost[];
};

export type TComment = {
  _id: string;
  content: string;
  author: TUser;
  post: TPost['_id'];
  likes: TLike[];
  createdAt: string;
  updatedAt: string;
};

export type TPost = {
  _id: string;
  content: string;
  author: TUser;
  comments: TComment[];
  likes: TLike[];
  createdAt: string;
  updatedAt: string;
};

export type TLike = {
  _id: string;
  user: TUser;
  post?: TPost;
  comment?: TComment;
  createdAt: string;
};

type FeedContextProps = {
  status: string;
  error: string;
  feed: TPost[];
  updateFeed: () => Promise<void>;
  addPostToFeed: (post: TPost) => void;
};

export const FeedContext = createContext<FeedContextProps>({
  status: STATUS.IDLE,
  error: '',
  feed: [],
  updateFeed: async () => {},
  addPostToFeed: () => {},
});

type FeedProviderProps = {
  children: ReactNode;
};

const FeedProvider: FC<FeedProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [feed, setFeed] = useState<TPost[]>([]);

  const addPostToFeed = (post: TPost) => {
    setFeed((prev) => [post, ...prev]);
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
      value={{ status, error, feed, updateFeed, addPostToFeed }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export default FeedProvider;
