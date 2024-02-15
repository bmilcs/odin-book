import { NotificationContext } from '@/context/notification-provider';
import { useContext } from 'react';

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be used within an AuthProvider',
    );
  }

  return context;
};
