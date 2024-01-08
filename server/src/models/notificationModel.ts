import { IPost } from '@/models/postModel';
import { IUser } from '@/models/userModel';
import mongoose, { Document, Schema, model, models } from 'mongoose';

export enum NotificationType {
  INCOMING_FRIEND_REQUEST = 'incoming_friend_request',
  ACCEPTED_FRIEND_REQUEST = 'accepted_friend_request',
  NEW_COMMENT = 'new_comment',
  NEW_POST = 'new_post',
}

export interface INotification extends Document {
  type: NotificationType;
  fromUser: IUser['_id'];
  toUser: IUser['_id'];
  post?: IPost['_id'];
}

const notificationSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    fromUser: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Types.ObjectId, ref: 'Post' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }, // auto create 'createdAt' and 'updatedAt' fields
);

// add notification to user's notifications array automatically
notificationSchema.pre<INotification>('save', async function (next) {
  const UserModel = models['User'];
  if (UserModel) {
    await UserModel.updateOne(
      { _id: this.toUser },
      { $addToSet: { notifications: this._id } },
    );
  }
  next();
});

// delete notification from user's notifications array automatically
notificationSchema.pre<INotification>('deleteOne', async function (next) {
  const UserModel = models['User'];
  if (UserModel) {
    await UserModel.updateOne(
      { _id: this.toUser },
      { $pull: { notifications: this._id } },
    );
  }
  next();
});

export default models['Notification'] ||
  model<INotification>('Notification', notificationSchema);
