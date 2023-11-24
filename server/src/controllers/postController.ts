import { commentModel, likeModel, postModel } from '@/models'; // Importing the commentModel, likeModel, and postModel from the '@/models' module
import { IComment } from '@/models/commentModel';
import { ILike } from '@/models/likeModel';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

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
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    const post = await postModel
      .findById(postId)
      .populate({
        path: 'author',
        select:
          '-password -friends -friendRequestsReceived -friendRequestsSent',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'likes',
          populate: {
            path: 'user',
            select:
              '-password -friends -friendRequestsReceived -friendRequestsSent',
          },
        },
      })
      .populate({
        path: 'likes',
        populate: {
          path: 'user',
          select:
            '-password -friends -friendRequestsReceived -friendRequestsSent',
        },
      });
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    res.success('Post found', post, 201);
  },
);

const updatePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { content } = req.body;
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    if (!content) {
      return next(new AppError('Please provide content for your post', 400));
    }
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    if (post.author.toString() !== req.userId) {
      return next(new AppError('Unauthorized', 401));
    }
    post.content = content;
    await post.save();
    res.success('Post updated', post, 201);
  },
);

const deletePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // delete all comments associated with the post
    const comments = await commentModel.find({ post: postId });
    await Promise.all(comments.map((comment) => comment.deleteOne()));
    // delete all likes associated with the post
    const likes = await likeModel.find({ post: postId });
    await Promise.all(likes.map((like) => like.deleteOne()));
    // delete the post
    await post.deleteOne();
    res.success('Post deleted');
  },
);

const likePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    const like = await likeModel.findOne({ user: req.userId, post: postId });
    if (like) {
      return next(new AppError('Post already liked', 400));
    }
    // create new like
    const newLike = await likeModel.create({ user: req.userId, post: postId });
    post.likes.push(newLike._id);
    await post.save();
    // return updated like info
    const data = {
      isLikedByUser: true,
      likeCount: post.likes.length,
    };
    res.success('Post liked', data, 201);
  },
);

const unlikePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    const like = await likeModel.findOne({ user: req.userId, post: postId });
    if (!like) {
      return next(new AppError('Post not liked', 400));
    }
    // delete like
    post.likes = post.likes.filter(
      (likeObj: ILike) => like._id.toString() !== likeObj._id.toString(),
    );
    await post.save();
    await like.deleteOne();
    // return updated like info
    const data = {
      isLikedByUser: false,
      likeCount: post.likes.length,
    };
    res.success('Post unliked', data, 201);
  },
);

const addComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { content } = req.body;
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    if (!content) {
      return next(new AppError('Please provide content for your comment', 400));
    }
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    const comment = await commentModel.create({
      author: req.userId,
      post: postId,
      content,
    });
    post.comments.push(comment._id);
    await post.save();
    res.success('Comment created', comment, 201);
  },
);

const editComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    if (!isValidObjectId(commentId)) {
      return next(new AppError('Invalid comment id', 400));
    }
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    if (!content) {
      return next(new AppError('Please provide content for your comment', 400));
    }
    // check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // check if comment exists
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }
    // check if user is authorized to edit comment
    if (comment.author.toString() !== req.userId) {
      return next(new AppError('Unauthorized', 401));
    }
    comment.content = content;
    comment.save();
    res.success('Comment updated', comment, 201);
  },
);

const likeComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    if (!isValidObjectId(commentId)) {
      return next(new AppError('Invalid comment id', 400));
    }
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // check if comment exists
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }
    // check if user has already liked comment
    const like = await likeModel.findOne({
      user: req.userId,
      comment: commentId,
    });
    if (like) {
      return next(new AppError('Comment already liked', 400));
    }
    // create like
    const newLike = await likeModel.create({
      user: req.userId,
      comment: commentId,
    });
    // link like to comment
    comment.likes.push(newLike._id);
    await comment.save();
    // return updated like info
    const data = {
      isLikedByUser: true,
      likeCount: comment.likes.length,
    };
    res.success('Comment liked', data, 201);
  },
);

const unlikeComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    if (!isValidObjectId(commentId)) {
      return next(new AppError('Invalid comment id', 400));
    }
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // check if comment exists
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }
    // find the like
    const like = await likeModel.findOne({
      user: req.userId,
      comment: commentId,
    });
    if (!like) {
      return next(new AppError('Comment not liked', 400));
    }
    // delete the like
    comment.likes = comment.likes.filter(
      (likeObj: ILike) => like._id.toString() !== likeObj._id.toString(),
    );
    await comment.save();
    await like.deleteOne();
    // return updated like info
    const data = {
      isLikedByUser: false,
      likeCount: comment.likes.length,
    };
    res.success('Comment unliked', data, 201);
  },
);

const deleteComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    if (!isValidObjectId(commentId)) {
      return next(new AppError('Invalid comment id', 400));
    }
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // check if comment exists
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }
    // check if user is authorized to delete comment
    if (comment.author.toString() !== req.userId) {
      return next(new AppError('Unauthorized', 401));
    }
    // delete comment from post
    post.comments = post.comments.filter(
      (comment: IComment['_id']) => comment.toString() !== comment._id,
    );
    await post.save();
    // delete all likes associated with the comment
    const likes = await likeModel.find({ comment: commentId });
    await Promise.all(likes.map((like) => like.deleteOne()));
    // delete comment
    await comment.deleteOne();
    res.success('Comment deleted');
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
  likeComment,
  unlikeComment,
};
