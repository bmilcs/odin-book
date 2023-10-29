import { tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const sendRequest = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('send friend request');
});

const acceptRequest = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('accept friend request');
});

const rejectRequest = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('reject friend request');
});

const deleteFriend = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('delete friend');
});

export default {
  sendRequest,
  acceptRequest,
  rejectRequest,
  deleteFriend,
};
