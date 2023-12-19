import api from '@/utils/api';
import STATUS from '@/utils/constants';
import { useState } from 'react';

type ApiResponse = {
  success: boolean;
  message: string;
  error: string;
};

const useFriends = () => {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState('');

  const sendFriendRequest = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');
    try {
      const { success, error } = await api.post<ApiResponse>(
        `/friends/send-request/${userId}`,
        {},
      );
      console.log(success, error);
      if (!success) {
        console.log(error);
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  };

  const acceptFriendRequest = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');
    try {
      const { success, error } = await api.patch<ApiResponse>(
        `/friends/accept-request/${userId}`,
        {},
      );
      console.log(success, error);
      if (!success) {
        console.log(error);
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  };

  const rejectFriendRequest = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');
    try {
      const { success, error } = await api.patch<ApiResponse>(
        `/friends/reject-request/${userId}`,
        {},
      );
      console.log(success, error);
      if (!success) {
        console.log(error);
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  };

  const deleteFriend = async (userId: string) => {
    setStatus(STATUS.LOADING);
    setError('');
    try {
      const { success, error } = await api.del<ApiResponse>(
        `/friends/${userId}`,
      );
      console.log(success, error);
      if (!success) {
        console.log(error);
        setStatus(STATUS.ERROR);
        setError(error);
        return;
      }
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.log(error);
    }
  };

  return {
    status,
    error,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriend,
  };
};

export default useFriends;
