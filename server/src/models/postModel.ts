import { IComment } from '@/models/commentModel';
import { ILike } from '@/models/likeModel';
import { IUser } from '@/models/userModel';
import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface IPost extends Document {
  content: string;
  author: IUser['_id'];
  comments: IComment['_id'][];
  likes: ILike['_id'][];
  date: Date;
}

const postSchema: Schema = new Schema({
  content: { type: String, required: true, maxlength: 1000 },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Types.ObjectId, ref: 'Like' }],
  date: { type: Date, default: Date.now },
});

export default models['Post'] || model<IPost>('Post', postSchema);
