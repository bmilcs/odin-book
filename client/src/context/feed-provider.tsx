import { useAuthContext } from '@/hooks/useAuthContext';
import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { getErrorMsg } from '@/utils/errors';
import { TApiResponse, TPost } from '@/utils/types';
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
};

export const FeedContext = createContext<FeedContextProps>({
  status: STATUS.IDLE,
  error: '',
  feed: [],
  updateFeed: async () => {},
  addPostToFeed: () => {},
  removePostFromFeed: () => {},
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
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export default FeedProvider;
