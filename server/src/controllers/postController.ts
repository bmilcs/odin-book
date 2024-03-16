import {
  commentModel,
  likeModel,
  notificationModel,
  postModel,
  userModel,
} from '@/models'; // Importing the commentModel, likeModel, and postModel from the '@/models' module
import { ILike } from '@/models/likeModel';
import { AppError, tryCatch } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

const createPost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const file = req.file;

    const { userId } = req;
    // check if content was provided
    if (!content) {
      return next(new AppError('Please provide content for your post', 400));
    }
    // check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return next(new AppError('Your user information was not found', 500));
    }
    // create post
    const post = await postModel.create({
      author: userId,
      content,
      image: file ? `/uploads/post-images/${file.filename}` : null,
    });

    if (!post) {
      return next(
        new AppError('Unable to create a post at this time', 500, 'AppError'),
      );
    }
    // populate post with author info
    await post.populate('author', '_id username email photo');
    // create notification for each friend
    const postId = post._id;
    await Promise.all(
      user.friends.map((friendId: string) => {
        return notificationModel
          .create({
            type: 'new_post',
            fromUser: userId,
            toUser: friendId,
            post: postId,
          })
          .catch((error) => {
            throw new AppError(
              'Unable to create notification for friend at this time',
              500,
              'AppError',
            );
          });
      }),
    );
    res.success('Post created', post, 201);
  },
);

const getPost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    // check if post id is valid
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // find post
    const post = await postModel
      .findById(postId)
      .populate({
        path: 'author',
        select: '_id username email photo',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'likes',
          populate: {
            path: 'user',
            select: '_id username email photo',
          },
        },
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: '_id username email photo',
        },
      })
      .populate({
        path: 'likes',
        populate: {
          path: 'user',
          select: '_id username email photo',
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
    // check if post id is valid
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // check if content was provided
    if (!content) {
      return next(new AppError('Please provide content for your post', 400));
    }
    // check if post exists
    const post = await postModel
      .findById(postId)
      .populate({
        path: 'author',
        select: '_id username email photo',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'likes',
          populate: {
            path: 'user',
            select: '_id username email photo',
          },
        },
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: '_id username email photo',
        },
      })
      .populate({
        path: 'likes',
        populate: {
          path: 'user',
          select: '_id username email photo',
        },
      });
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // check if user is authorized to edit post
    if (post.author._id.toString() !== req.userId) {
      return next(new AppError('Unauthorized', 401));
    }
    // update post
    post.content = content;
    await post.save();
    res.success('Post updated', post, 201);
  },
);

const deletePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    // check if post id is valid
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // delete the post, triggering the pre('deleteOne') middleware
    // in the post schema to delete all associated comments and likes
    await post.deleteOne();
    res.success('Post deleted', null, 200);
  },
);

const likePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    // check if post id is valid
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // check if user has already liked post
    const like = await likeModel.findOne({ user: req.userId, post: postId });
    if (like) {
      return next(new AppError('Post already liked', 400));
    }
    // create new like
    const newLike = await likeModel.create({ user: req.userId, post: postId });
    // link like to post
    post.likes.push(newLike._id);
    await post.save();
    // return updated like info
    await newLike.populate('user', '_id username email photo');
    const data = {
      isLikedByUser: true,
      likeCount: post.likes.length,
      likeDetails: newLike,
    };
    res.success('Post liked', data, 201);
  },
);

const unlikePost = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    // check if post id is valid
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // find the like
    const like = await likeModel.findOne({ user: req.userId, post: postId });
    if (!like) {
      return next(new AppError('Post not liked', 400));
    }
    // delete like from post
    post.likes = post.likes.filter(
      (likeObj: ILike) => like._id.toString() !== likeObj._id.toString(),
    );
    await post.save();
    // delete like
    await like.deleteOne();
    // return updated like info
    const data = {
      isLikedByUser: false,
      likeCount: post.likes.length,
      likeDetails: null,
    };
    res.success('Post unliked', data, 201);
  },
);

const addComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = req;
    // check if post id is valid
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // check if content was provided
    if (!content) {
      return next(new AppError('Please provide content for your comment', 400));
    }
    // check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // create comment & link to post
    const comment = await commentModel.create({
      author: req.userId,
      post: postId,
      likes: [],
      content,
    });
    post.comments.push(comment._id);
    await post.save();
    // populate comment with author info
    await comment.populate('author', '_id username email photo');
    // create notification for post author
    const isCommentingOnOwnPost = userId === post.author.toString();
    if (!isCommentingOnOwnPost) {
      await notificationModel.create({
        type: 'new_comment',
        fromUser: userId,
        toUser: post.author,
        post: postId,
        comment: comment._id,
      });
    }
    res.success('Comment created', comment, 201);
  },
);

const editComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    // check if comment id is valid
    if (!isValidObjectId(commentId)) {
      return next(new AppError('Invalid comment id', 400));
    }
    // check if post id is valid
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // check if content was provided
    if (!content) {
      return next(new AppError('Please provide content for your comment', 400));
    }
    // check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    // check if comment exists
    const comment = await commentModel
      .findById(commentId)
      .populate('author', { _id: 1, username: 1, email: 1 })
      .populate({
        path: 'likes',
        populate: {
          path: 'user',
          select: '_id username email photo',
        },
      });
    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }
    // check if user is authorized to edit comment
    if (comment.author._id.toString() !== req.userId) {
      return next(new AppError('Unauthorized', 401));
    }
    // update comment
    comment.content = content;
    comment.save();
    // add author details to comment
    await comment.populate('author', '_id username email photo');
    res.success('Comment updated', comment, 201);
  },
);

const likeComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    // check if comment id is valid
    if (!isValidObjectId(commentId)) {
      return next(new AppError('Invalid comment id', 400));
    }
    // check if post id is valid
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
    await newLike.populate('user', '_id username email photo');
    const data = {
      isLikedByUser: true,
      likeCount: comment.likes.length,
      likeDetails: newLike,
    };
    res.success('Comment liked', data, 201);
  },
);

const unlikeComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    // check if comment id is valid
    if (!isValidObjectId(commentId)) {
      return next(new AppError('Invalid comment id', 400));
    }
    // check if post id is valid
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
      likeDetails: null,
    };
    res.success('Comment unliked', data, 201);
  },
);

const deleteComment = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    // check if comment id is valid
    if (!isValidObjectId(commentId)) {
      return next(new AppError('Invalid comment id', 400));
    }
    // check if post id is valid
    if (!isValidObjectId(postId)) {
      return next(new AppError('Invalid post id', 400));
    }
    // check if post exists
    const post = await postModel.exists({ _id: postId });
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
    // delete comment, triggering the pre('deleteOne') middleware
    // in the comment schema to delete all associated post refs, likes, notifications
    await comment.deleteOne();
    res.success('Comment deleted', null, 200);
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
