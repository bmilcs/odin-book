import commentModel, { IComment } from '@/models/commentModel';
import likeModel, { ILike } from '@/models/likeModel';
import notificationModel from '@/models/notificationModel';
import { IUser } from '@/models/userModel';
import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface IPost extends Document {
  content: string;
  author: IUser['_id'];
  comments: IComment['_id'][];
  likes: ILike['_id'][];
}

const postSchema: Schema = new Schema(
  {
    content: { type: String, required: true, maxlength: 1000 },
    author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'Like' }],
  },
  { timestamps: true }, // auto create 'createdAt' and 'updatedAt' fields
);

// delete all notifications, likes, and comments associated with the post
postSchema.pre<IPost>('deleteOne', { document: true }, async function (next) {
  const postId = this._id;
  await notificationModel.deleteMany({ post: postId });
  await likeModel.deleteMany({ post: postId });
  await commentModel.deleteMany({ post: postId });
  next();
});

export default models['Post'] || model<IPost>('Post', postSchema);
