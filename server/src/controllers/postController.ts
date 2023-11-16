import { postModel } from '@/models';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const createPost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    if (!content) {
      return next(new AppError('Please provide content for your post', 400));
    }
    const post = await postModel.create({ author: req.userId, content });
    if (!post) {
      return next(
        new AppError('Unable to create a post at this time', 500, 'AppError'),
      );
    }
    res.success('Post created', post, 201);
  },
);

const getPost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('get post');
  },
);

const updatePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('update post');
  },
);

const deletePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('delete post');
  },
);

const likePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('like post');
  },
);

const unlikePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('unlike post');
  },
);

const addComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('add post comment');
  },
);

const editComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('edit post comment');
  },
);

const deleteComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.success('delete post comment');
  },
);

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
