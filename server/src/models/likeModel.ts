import { Document, Schema, model, models } from 'mongoose';
import { IComment } from './commentModel';
import { IPost } from './postModel';
import { IUser } from './userModel';

export interface ILike extends Document {
  user: IUser['_id'];
  post?: IPost['_id'];
  comment?: IComment['_id'];
}

const likeSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }, // auto create 'createdAt' and 'updatedAt' fields
);

likeSchema.index(
  { user: 1, post: 1 },
  { unique: true, partialFilterExpression: { post: { $exists: true } } },
);

likeSchema.index(
  { user: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } },
);

export default models['Like'] || model<ILike>('Like', likeSchema);
