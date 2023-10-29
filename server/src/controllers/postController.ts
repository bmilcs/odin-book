import { tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const createPost = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('create post');
});

const getPost = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('view post');
});

const updatePost = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('update post');
});

const deletePost = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('delete post');
});

const likePost = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('like post');
});

const unlikePost = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('unlike post');
});

const addComment = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('add post comment');
});

const editComment = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('edit post comment');
});

const deleteComment = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('delete post comment');
});

export default {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  editComment,
  deleteComment,
};
