import { AuthContext, TUser } from '@/components/services/auth-provider';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type ApiResponse = {
  success: boolean;
  data: TPost[];
  error: string;
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
};

export const FeedContext = createContext<FeedContextProps>({
  status: STATUS.IDLE,
  error: '',
  feed: [],
  updateFeed: async () => {},
});

type FeedProviderProps = {
  children: ReactNode;
};

const FeedProvider: FC<FeedProviderProps> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');
  const [feed, setFeed] = useState<TPost[]>([]);

  const updateFeed = useCallback(async () => {
    setStatus(STATUS.LOADING);
    setFeed([]);
    try {
      const { success, error, data } = await api.get<ApiResponse>('/feed');
      if (success) {
        setStatus(STATUS.SUCCESS);
        setFeed(data);
        return;
      }
      setError(error);
      setStatus(STATUS.ERROR);
    } catch (error) {
      setStatus(STATUS.ERROR);
      setError('Unable to load feed at this time');
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      updateFeed();
    }
  }, [isAuthenticated, updateFeed]);

  return (
    <FeedContext.Provider value={{ status, error, feed, updateFeed }}>
      {children}
    </FeedContext.Provider>
  );
};

export default FeedProvider;
