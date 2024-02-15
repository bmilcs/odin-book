import { FeedContext } from '@/context/feed-provider';
import { useContext } from 'react';

export const useFeedContext = () => {
  const context = useContext(FeedContext);

  if (context === undefined) {
    throw new Error('useFeedContext must be used within an AuthProvider');
  }

  return context;
};
