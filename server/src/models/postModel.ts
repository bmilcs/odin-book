import { IComment } from '@/models/commentModel';
import { ILike } from '@/models/likeModel';
import { IUser } from '@/models/userModel';
import mongoose, { Document, Schema, model } from 'mongoose';

export interface IPost extends Document {
  content: string;
  author: IUser['_id'];
  comments: IComment['_id'][];
  likes: ILike['_id'][];
}

const postSchema: Schema = new Schema({
  content: { type: String, required: true, maxlength: 1000 },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Types.ObjectId, ref: 'Like' }],
});

export default model<IPost>('Post', postSchema);
