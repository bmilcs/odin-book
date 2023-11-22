import { IPost } from '@/models/postModel';
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

export default models['Comment'] || model<IComment>('Comment', CommentSchema);
