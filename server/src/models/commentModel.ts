import likeModel from '@/models/likeModel';
import notificationModel from '@/models/notificationModel';
import postModel, { IPost } from '@/models/postModel';
import { IUser } from '@/models/userModel';
import { Document, Schema, model, models } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: IUser['_id'];
  post: IPost['_id'];
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true, maxlength: 1000 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  },
  { timestamps: true }, // auto create 'createdAt' and 'updatedAt' fields
);

// delete all post refs, notifications and likes associated with the comment
CommentSchema.pre<IComment>(
  'deleteOne',
  { document: true },
  async function (next) {
    const { author: commentAuthor, _id: commentId, post: postId } = this;
    // delete comment ref from post
    const post = await postModel.findById(postId, 'comments');
    post.comments = post.comments.filter(
      (comment: IComment['_id']) => comment.toString() !== comment._id,
    );
    await post.save();
    // delete notifications
    await notificationModel.deleteOne({
      post: postId,
      comment: commentId,
      fromUser: commentAuthor,
      type: 'new_comment',
    });
    // delete likes
    await likeModel.deleteMany({ comment: commentId });
    next();
  },
);

export default models['Comment'] || model<IComment>('Comment', CommentSchema);
