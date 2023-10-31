import { IPost } from '@/models/postModel';
import { IUser } from '@/models/userModel';
import { Document, Schema, model, models } from 'mongoose';

export interface IComment extends Document {
  text: string;
  author: IUser['_id'];
  post: IPost['_id'];
}

const CommentSchema: Schema = new Schema({
  text: { type: String, required: true, maxlength: 1000 },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
});

export default models['Comment'] || model<IComment>('Comment', CommentSchema);
