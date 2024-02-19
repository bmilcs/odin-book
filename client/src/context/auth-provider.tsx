import LoadingPage from '@/pages/loading-page';
import api from '@/utils/api';
import { getErrorMsg } from '@/utils/errors';
import {
  TApiResponse,
  TFriend,
  TFriendRequest,
  TUser,
  TUserProfileDetails,
} from '@/utils/types';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

type FetchUserDataApiResponse = TApiResponse & {
  data: TUser;
};

type AuthContextProps = {
  user: TUser | null;
  friends: TFriend[];
  friendRequestsSent: TFriendRequest[];
  friendRequestsReceived: TFriendRequest[];
  setUserData: (data: TUser) => void;
  clearUserData: () => void;
  fetchUserData: () => void;
  setUserProfileDetails: (profile: TUserProfileDetails) => void;
  setUserProfileImage: (image: string) => void;
  isAuthenticated: () => boolean;
  redirectUnauthenticatedUser: (path: string) => void;
  redirectAuthenticatedUser: (path: string) => void;
  addToFriends: (newUser: TFriend) => void;
  addToSentFriendRequests: (newUser: TFriendRequest) => void;
  removeFromSentFriendRequests: (userId: string) => void;
  removeFromReceivedFriendRequests: (userId: string) => void;
  removeFromFriends: (userId: string) => void;
};

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUserData: () => {},
  clearUserData: () => {},
  fetchUserData: () => {},
  setUserProfileDetails: () => {},
  setUserProfileImage: () => {},
  friends: [],
  friendRequestsSent: [],
  friendRequestsReceived: [],
  isAuthenticated: () => false,
  redirectUnauthenticatedUser: () => {},
  redirectAuthenticatedUser: () => {},
  addToSentFriendRequests: () => {},
  addToFriends: () => {},
  removeFromSentFriendRequests: () => {},
  removeFromReceivedFriendRequests: () => {},
  removeFromFriends: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [user, setUser] = useState<TUser | null>(null);
  const [friends, setFriends] = useState<TFriend[]>([]);
  const [friendRequestsSent, setFriendRequestsSent] = useState<
    TFriendRequest[]
  >([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState<
    TFriendRequest[]
  >([]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    if (isLoading) return false;
    return !!user;
  }, [isLoading, user]);

  // Redirect user if they are not authenticated
  const redirectUnauthenticatedUser = useCallback(
    (path: string) => {
      if (isLoading) return;
      if (!isAuthenticated()) {
        navigate(path);
      }
    },
    [isLoading, isAuthenticated, navigate],
  );

  // Redirect user if they are authenticated
  const redirectAuthenticatedUser = useCallback(
    (path: string) => {
      if (isLoading) return;
      if (isAuthenticated()) {
        navigate(path);
      }
    },
    [isLoading, isAuthenticated, navigate],
  );

  // Initialize user data
  const setUserData = (data: TUser) => {
    setUser(data);
    setFriends(data.friends);
    setFriendRequestsSent(data.friendRequestsSent);
    setFriendRequestsReceived(data.friendRequestsReceived);
  };

  // Clear user data
  const clearUserData = () => {
    setUser(null);
    setFriends([]);
    setFriendRequestsSent([]);
    setFriendRequestsReceived([]);
  };

  // Add a user to the friends list
  const addToFriends = (newUser: TFriend) => {
    setFriendRequestsReceived((prev) => {
      return prev.filter((user) => user._id !== newUser._id);
    });
    setFriends((prev) => {
      return [...prev, newUser];
    });
  };

  // Add a user to the sent friend requests list
  const addToSentFriendRequests = (newUser: TFriendRequest) => {
    setFriendRequestsSent((prev) => {
      return [...prev, newUser];
    });
  };

  // Remove a user from the sent friend requests list
  const removeFromSentFriendRequests = (userId: string) => {
    setFriendRequestsSent((prev) => {
      return prev.filter((user) => user._id !== userId);
    });
  };

  // Remove a user from the received friend requests list
  const removeFromReceivedFriendRequests = (userId: string) => {
    setFriendRequestsReceived((prev) => {
      return prev.filter((user) => user._id !== userId);
    });
  };

  // Remove a user from the friends list
  const removeFromFriends = (userId: string) => {
    setFriends((prev) => {
      return prev.filter((user) => user._id !== userId);
    });
  };

  // Update user profile changes
  const setUserProfileDetails = (profile: TUserProfileDetails) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...profile };
    });
  };

  // Update user profile image
  const setUserProfileImage = (image: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, photo: image };
    });
  };

  // Fetch user data using httpOnly cookies
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { success, data } =
        await api.get<FetchUserDataApiResponse>('/auth/status');
      if (success) {
        setUserData(data);
        return;
      }
      setUser(null);
    } catch (error) {
      setUser(null);
      const errorMsg = getErrorMsg(error);
      console.log(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  // Fetch user data on initial load
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Show spinner while waiting for user data to load for at least 250ms
  // This prevents the spinner from flashing on the screen for a split second
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 250);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoading]);

  // Show spinner while waiting for user data to load
  if (showSpinner) {
    return <LoadingPage />;
  }

  // Provide user data to the app
  return (
    <AuthContext.Provider
      value={{
        user,
        setUserData,
        clearUserData,
        fetchUserData,
        setUserProfileImage,
        setUserProfileDetails,
        friends,
        friendRequestsSent,
        friendRequestsReceived,
        isAuthenticated,
        redirectUnauthenticatedUser,
        redirectAuthenticatedUser,
        addToFriends,
        addToSentFriendRequests,
        removeFromSentFriendRequests,
        removeFromReceivedFriendRequests,
        removeFromFriends,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
